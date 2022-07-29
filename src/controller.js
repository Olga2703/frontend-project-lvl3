import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import _ from 'lodash';
import validate from './validate.js';
import getParsePage from './parser.js';

const routes = {
  addProxy: (link) => {
    const proxyLink = new URL('/get', 'https://allorigins.hexlet.app');
    proxyLink.searchParams.set('disableCache', true);
    proxyLink.searchParams.set('url', link);
    return proxyLink.href;
  },
};

const getFeeds = (state, link, i18n) => {
  state.form.error = null;
  const createFlowLink = routes.addProxy(link);
  axios
    .get(createFlowLink)
    .then((response) => {
      const feedData = getParsePage(response.data.contents);
      const id = uniqueId();
      state.links = [...state.links, link];

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
    .catch((err) => {
      if (err.code === 'ERR_NETWORK') {
        state.form.error = 'form.ERR_NETWORK';
        throw new Error('form.ERR_NETWORK');
      } else {
        state.form.error = i18n.t(err.message);
        throw new Error(err);
      }
    });
};

const updatePosts = (state, i18n) => {
  const promisesPost = state.links.map((link) => axios.get(routes.addProxy(link)));
  Promise.all(promisesPost)
    .then((response) => {
      response.forEach((posts) => {
        try {
          const contents = getParsePage(posts.data.contents);
          const feedId = _.find(state.feeds, ['title', contents.feedTitle]).id;
          const newPosts = _.differenceBy(contents.feedPosts, state.posts, 'guid').map((post) => ({ ...post, feedId }));
          state.posts = [...state.posts, ...newPosts];
        } catch (err) {
          state.form.error = i18n.t(err.message);
          throw new Error(err);
        }
      });
    })
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

const handleView = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url').trim();

    state.form.error = null;
    validate(value, state.links)
      .catch((err) => {
        state.form.error = i18n.t(err.message);
        throw new Error(err);
      })
      .then(() => {
        getFeeds(state, value, i18n);
      });

    updatePosts(state);
  });
};

export default handleView;
