import 'bootstrap';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';
import render from './render.js';

import view from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    inputUrl: document.querySelector('#url-input'),
    submitButton: document.querySelector('input[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const i18nInstance = i18n.createInstance();

  const state = onChange(
    {
      lng: 'ru',
      form: {
        valid: true,
        feedbackError: null,
        links: [],
      },
    },
    render(elements, i18nInstance)
  );

  i18nInstance
    .init({
      lng: state.lng,
      debug: true,
      resources,
    })
    .then(view(elements, state, i18nInstance));
};
