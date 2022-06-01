import validate from './validate.js';

const runValidate = (state, link, i18n) => {
  state.feedbackError = null;
  validate(link, state.form.links, i18n)
    .then(() => {
      state.form.links.push(link);
    })
    .catch((err) => {
      state.form.feedbackError = err.message;
    });
};

const view = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    runValidate(state, value, i18n);
  });
};

export default view;
