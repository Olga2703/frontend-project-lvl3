import axios from 'axios';


import validate from './validate.js';
import getParsePage from './parser.js';

const routes = {
  allOrigins: (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${link}`)}`,
};

const runValidate = (state, link, i18n) => {
  state.feedback = null;
  validate(link, state.form.links, i18n)
    .then(() => {
      state.form.feedback = 'success';
      state.form.links.push(link);
    })
    .catch((err) => {
      state.form.feedback = err.message;
    });
};

const getRequest = (link) => axios.get(link)
  .then((response) => response.data);

const getFeeds = (state, link) => {
  getRequest(link).then((data) => {
    const page = getParsePage(data.contents);
    console.log(page);
  });
}

const view = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url');

    runValidate(state, value, i18n);

    state.form.links.forEach((link) => {
      const createFlowLink = routes.allOrigins(link);
      getFeeds(state, createFlowLink);
    });
  });
};

export default view;
