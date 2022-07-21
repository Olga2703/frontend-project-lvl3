import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: 'form.errorMessages.duplicate_link',
    required: 'form.errorMessages.field_required',
  },
  string: {
    url: 'form.errorMessages.not_valid_url',
  },
});

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
