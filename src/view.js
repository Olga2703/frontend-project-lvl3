import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import _ from 'lodash';
import validate from './validate.js';
import getParsePage from './parser.js';

const routes = {
  allOrigins: (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${link}`)}`,
};

const getRequest = (link) => axios.get(link).then((response) => response.data);

const getFeeds = (state, link) => {
  const createFlowLink = routes.allOrigins(link);
  getRequest(createFlowLink)
    .then((data) => {
      const feedData = getParsePage(data.contents, state);
      const id = uniqueId();
      state.form.links = [...state.form.links, link];

      const feed = {
        title: feedData.feedTitle,
        description: feedData.feedDescription,
        id,
      };
      const posts = feedData.feedPosts.map((post) => ({ ...post, feedId: id }));
      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      state.processState = 'success';
    })
    .catch(() => {
      state.processState = 'error';
    });
};

const updatePosts = (state) => {
  const promisesPost = state.form.links.map((link) => getRequest(routes.allOrigins(link)));
  const promise = Promise.all(promisesPost);
  promise
    .then((dates) => {
      dates.forEach((data) => {
        const contents = getParsePage(data.contents, state);
        const feedId = _.find(state.feeds, ['title', contents.feedTitle]).id;
        const newPosts = _.differenceBy(contents.feedPosts, state.posts, 'guid').map((post) => ({ ...post, feedId }));
        state.posts = [...state.posts, ...newPosts];
      });
    })
    .catch(() => {
      state.processState = 'error';
    })
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

const runValidate = (state, link, i18n) => {
  state.form.feedback = null;
  validate(link, state.form.links, i18n)
    .then(() => {
      getFeeds(state, link);
    })
    .catch((err) => {
      state.form.feedback = err.message;
      state.form.valid = false;
    });
};

const view = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url').trim();

    runValidate(state, value, i18n);
    updatePosts(state);
  });
};

export default view;
