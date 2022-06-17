const clearClassList = (elements) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.inputUrl.classList.remove('is-invalid');
};

const renderFeedback = (elements, value) => {
  if (value === null) {
    return;
  }
  clearClassList(elements);

  elements.feedback.textContent = value;
  elements.feedback.classList.add('text-danger');
  elements.inputUrl.classList.add('is-invalid');
};

const renderPost = (elements, state, i18n) => {
  clearClassList(elements);
  elements.feedback.textContent = i18n.t('form.successMessages');
  elements.feedback.classList.add('text-success');

  const containerCard = document.createElement('div');
  containerCard.classList.add('card', 'border-0');
  elements.feedContainer.append(containerCard);
  console.log(containerCard);
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  containerCard.append(cardBody);

  const cardbodyTitle = document.createElement('h2');
  cardbodyTitle.classList.add('card-title', 'h4');
  cardbodyTitle.textContent = 'Фиды';
  cardBody.append(cardbodyTitle);

  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feedContainer.append(ulFeeds);
  const listFeeds = state.feeds
    .map((feed) => {
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
    })
    .forEach((element) => ulFeeds.append(element));
};

const handlerProcessState = (elements, state, process, i18n) => {
  switch (process) {
    case 'success':
      renderPost(elements, state, i18n);
      state.processState = 'filling';
      break;
    case 'parseError':
      throw new Error('parser error');
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

    default:
      break;
  }
};
