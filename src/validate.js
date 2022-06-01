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

const validate = (link, links, i18n) => {
  const schema = yup.string().url().notOneOf(links).required();
  return schema
    .validate(link)
    .then(() => null)
    .catch((err) => {
      throw new Error(i18n.t(err.errors[0]));
    });
};

export default validate;
