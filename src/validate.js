import * as yup from 'yup';

const validate = (link, links) => {
  const schema = yup.string().url().notOneOf(links).required();
  return schema
    .validate(link)
    .then(() => null)
    .catch((err) => {
      const [validateError] = err.errors;
      throw new Error(validateError);
    });
};

export default validate;
