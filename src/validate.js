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
      // throw new Error(i18n.t(err.errors[0]));
      throw new Error(err.errors[0]);
      // console.log(err.errors[0]);
      // return err.errors[0];
    });
};

export default validate;
