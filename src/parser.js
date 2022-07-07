const getParsePage = (page, type = 'application/xml') => {
  const getPostInfo = (post) => ({
    title: post.querySelector('title').textContent,
    guid: post.querySelector('guid').textContent,
    link: post.querySelector('link').textContent,
    description: post.querySelector('description').textContent,
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(page, type);
  if (doc.querySelector('parsererror')) {
    throw new Error('form.notValidRss');
  }

  return {
    feedTitle: doc.querySelector('title').textContent,
    feedDescription: doc.querySelector('description').textContent,
    feedPosts: [...doc.querySelectorAll('item')].map(getPostInfo),
  };
};

export default getParsePage;
