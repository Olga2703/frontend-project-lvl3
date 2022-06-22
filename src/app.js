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
    postContainer: document.querySelector('.posts'),
    feedContainer: document.querySelector('.feeds'),
    button: document.querySelector('button[data-bs-toggle="modal"]'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalBtnLink: document.querySelector('.modal-footer > a'),
  };

  const i18nInstance = i18n.createInstance();

  const state = {
    lng: 'ru',
    processState: 'filling',
    form: {
      valid: true,
      feedback: null,
      links: [],
    },
    posts: [],
    feeds: [],
    stateUI: {
      viewed: [],
    },
  };

  const watchState = onChange(state, render(elements, state, i18nInstance));

  i18nInstance
    .init({
      lng: state.lng,
      debug: true,
      resources,
    })
    .then(view(elements, watchState, i18nInstance));
};
