import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import _ from 'lodash';
import validate from './validate.js';
import getParsePage from './parser.js';

const routes = {
  allOrigins: (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${link}`)}`,
};

const getFeeds = (state, link) => {
  state.form.error = null;
  const createFlowLink = routes.allOrigins(link);
  axios
    .get(createFlowLink)
    .catch(() => {
      state.form.error = 'form.netErrors';
      throw new Error('form.netErrors');
    })
    .then((response) => {
      const feedData = getParsePage(response.data.contents, state);
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
    });
};

const updatePosts = (state) => {
  const promisesPost = state.links.map((link) => axios.get(routes.allOrigins(link)));
  Promise.all(promisesPost)
    .then((dates) => {
      dates.forEach((response) => {
        const contents = getParsePage(response.data.contents, state);
        const feedId = _.find(state.feeds, ['title', contents.feedTitle]).id;
        const newPosts = _.differenceBy(contents.feedPosts, state.posts, 'guid').map((post) => ({ ...post, feedId }));
        state.posts = [...state.posts, ...newPosts];
      });
    })
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

// const runValidate = (state, link, i18n) => {
//   state.form.status = null;
//   state.form.error = null;
//   validate(link, state.links, i18n)
//     .then(() => {
//       getFeeds(state, link);
//     })
//     .catch((err) => {
//       state.form.error = err.message;
//     });
// };

const handleView = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url').trim();

    // runValidate(state, value, i18n);
    state.form.error = null;
    validate(value, state.links)
      .catch((err) => {
        state.form.error = i18n.t(err.message);
        throw new Error(err);
      })
      .then(() => {
        getFeeds(state, value);
      });

    updatePosts(state);
  });
};

export default handleView;
