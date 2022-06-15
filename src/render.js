const clearClassList = (elements) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.inputUrl.classList.remove('is-invalid');
}

const renderFeedback = (elements, value, i18n) => {
  if (value === null) {
    return;
  }

  clearClassList(elements);

  if (value === 'success') {
    elements.feedback.textContent = i18n.t('form.successMessages');
    elements.feedback.classList.add('text-success');
  } else {
    elements.feedback.textContent = value;
    elements.feedback.classList.add('text-danger');
    elements.inputUrl.classList.add('is-invalid');
  }
};

export default (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.feedback':
      renderFeedback(elements, value, i18n);
      break;
    case 'form.links':
      break;

    default:
      break;
  }
};
