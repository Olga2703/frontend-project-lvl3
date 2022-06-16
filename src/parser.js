const getParsePage = (page, state) => {
  const getPostInfo = (post) => ({
    title: post.querySelector('title').textContent,
    guid: post.querySelector('guid').textContent,
    link: post.querySelector('link').textContent,
    description: post.querySelector('description').textContent,
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(page, 'application/xml');
  if (doc.querySelector('parsererror')) {
    state.processState = 'parseError';
  }

  return {
    feedTitle: doc.querySelector('title').textContent,
    feedDescription: doc.querySelector('description').textContent,
    feedPosts: [...doc.querySelectorAll('item')].map(getPostInfo),
  };
};

export default getParsePage;
