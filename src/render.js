import uniqueId from 'lodash/uniqueId.js';

const clearClassList = (elements) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.inputUrl.classList.remove('is-invalid');
};

const changeClasses = (element, [...oldClasses], [...newClasses]) => {
  oldClasses.forEach((oldClass) => element.classList.remove(oldClass));
  newClasses.forEach((newClass) => element.classList.add(newClass));
};

const renderFeedback = (elements, value) => {
  if (value === null) {
    return;
  }
  clearClassList(elements);
  elements.inputUrl.select();

  elements.feedback.textContent = value;
  elements.feedback.classList.add('text-danger');
  elements.inputUrl.classList.add('is-invalid');
};

const createContainer = (name) => {
  const containerCard = document.createElement('div');
  containerCard.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardbodyTitle = document.createElement('h2');
  cardbodyTitle.classList.add('card-title', 'h4');
  cardbodyTitle.textContent = `${name}`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  return {
    containerCard,
    cardBody,
    cardbodyTitle,
    ul,
  };
};

const renderFeeds = (elements, state, i18n) => {
  clearClassList(elements);
  elements.form.reset();
  elements.inputUrl.focus();
  elements.feedback.textContent = i18n.t('form.successMessages');
  elements.feedback.classList.add('text-success');

  const containers = createContainer('Фиды');

  const listFeeds = state.feeds.map((feed) => {
    const elementLi = document.createElement('li');
    elementLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    elementLi.append(h3);
    elementLi.append(p);
    return elementLi;
  });

  listFeeds.forEach((element) => containers.ul.append(element));
  containers.cardBody.append(containers.cardbodyTitle);
  containers.containerCard.append(containers.cardBody);
  elements.feedContainer.replaceChildren(containers.containerCard, containers.ul);
};

const renderPosts = (elements, state) => {
  const containers = createContainer('Посты');
  const listPosts = state.posts.map((post) => {
    const elementLi = document.createElement('li');
    elementLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const elementLink = document.createElement('a');
    elementLink.classList.add('fw-bold');
    const id = uniqueId();
    elementLink.dataset.id = id;
    elementLink.setAttribute('target', '_blank');
    elementLink.rel = 'noopener noreferrer';
    elementLink.href = post.link;
    elementLink.textContent = post.title;

    const elementBtn = document.createElement('button');
    elementBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    elementBtn.dataset.id = id;
    elementBtn.dataset.bsToggle = 'modal';
    elementBtn.dataset.bsTarget = '#modal';
    elementBtn.type = 'button';
    elementBtn.textContent = 'Просмотр';

    elementLi.append(elementLink);
    elementLi.append(elementBtn);

    elementBtn.addEventListener('click', () => {
      elements.modalTitle.textContent = post.title;
      elements.modalBody.textContent = post.description;
      elements.modalBtnLink.href = post.link;
      if (state.stateUI.viewed === null) {
        state.stateUI.viewed = new Set(state.stateUI.viewed);
      }
      state.stateUI.viewed.add(post.guid);
      if (state.stateUI.viewed.has(post.guid)) {
        changeClasses(elementLink, ['fw-bold'], ['fw-normal', 'link-secondary']);
      }
    });
    if (state.stateUI.viewed !== null && state.stateUI.viewed.has(post.guid)) {
      changeClasses(elementLink, ['fw-bold'], ['fw-normal', 'link-secondary']);
    }
    return elementLi;
  });

  listPosts.forEach((element) => containers.ul.append(element));
  containers.cardBody.append(containers.cardbodyTitle);
  containers.containerCard.append(containers.cardBody);
  elements.postContainer.replaceChildren(containers.containerCard, containers.ul);
};

const handlerProcessState = (elements, state, process, i18n) => {
  switch (process) {
    case 'success':
      renderFeeds(elements, state, i18n);
      renderPosts(elements, state, i18n);
      state.processState = 'filling';
      break;
    case 'error':
      throw new Error('parser error or net error');
    default:
      throw new Error(`Unknown process state: ${process}`);
  }
};

export default (elements, state, i18n) => (path, value) => {
  switch (path) {
    case 'form.feedback':
      renderFeedback(elements, value);
      break;
    case 'processState':
      handlerProcessState(elements, state, value, i18n);
      break;
    case 'posts':
      renderPosts(elements, state, i18n);
      break;
    default:
      break;
  }
};
