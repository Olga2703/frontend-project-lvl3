const renderError = (errors, prevErrors) => {
  const inputUrl = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  inputUrl.classList.add('is-invalid');
  feedback.textContent = errors;
};

export default (path, value, prevValue) => {
  switch (path) {
    case 'form.errors':
      renderError(value, prevValue);
      break;

    default:
      break;
  }
};
