import 'bootstrap';
import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import render from './render.js';

import handleView from './controller.js';

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

  yup.setLocale({
    mixed: {
      notOneOf: 'form.errorMessages.duplicate_link',
      required: 'form.errorMessages.field_required',
    },
    string: {
      url: 'form.errorMessages.not_valid_url',
    },
  });

  const state = {
    processState: 'filling',
    form: {
      status: null,
      error: null,
    },
    links: [],
    posts: [],
    feeds: [],
    stateUI: {
      seenPosts: null,
    },
  };

  const watchState = onChange(state, render(elements, state, i18nInstance));

  return i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(handleView(elements, watchState, i18nInstance));
};
