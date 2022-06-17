import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
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
      const feed = {
        title: feedData.feedTitle,
        description: feedData.feedDescription,
        id: uniqueId(),
      };
      const posts = feedData.feedPosts.map((post) => ({ ...post, feedId: feed.id }));
      state.form.links = [...state.form.links, link];
      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      console.log(state.posts);
      state.processState = 'success';
    })
    .catch(() => {
      throw new Error('net error');
    });
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
  });
};

export default view;
