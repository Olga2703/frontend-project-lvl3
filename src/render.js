const renderError = (elements, errors) => {
  if (errors === null) {
    return;
  }
  elements.feedback.textContent = errors;
  elements.inputUrl.classList.add('is-invalid');
};

export default (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.feedbackError':
      renderError(elements, value);
      break;

    default:
      break;
  }
};
