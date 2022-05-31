import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';

export default (state) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    inputUrl: document.querySelector('#url-input'),
    submitButton: document.querySelector('input[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  yup.setLocale({
    mixed: {
      notOneOf: 'form.errorMessages.duplicate_link',
      required: 'form.errorMessages.field_required',
    },
    string: {
      url: () => ({ key: 'form.errorMessages.not_valid_url' }),
    },
  });
  const getSchema = (arr) => yup.string().url().notOneOf(arr).required();

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  elements.inputUrl.addEventListener('change', (e) => {
    const { value } = e.target;
    state.form.inputValue = value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = state.form.inputValue;
    console.log(value);
    const schema = getSchema(state.form.feeds);
    schema
      .validate(value)
      .catch((error) => {
        const errors = error.errors.map((err) => i18nInstance.t(err.key));
        state.form.errors = [...errors];
        state.form.valid = false;
        throw new Error(errors);
      })
      .then(() => {
        state.form.valid = true;
        state.form.feeds.push(value);
      });
  });
};
