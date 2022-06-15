const getParsePage = (page) => {

    
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, 'application/xml');
  return doc;
};

export default getParsePage;
