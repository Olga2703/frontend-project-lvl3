import onChange from 'on-change';
import render from './render.js';

const state = {
  form: {
    valid: true,
    inputValue: '',
    feeds: [],
    errors: '',
  },
};
const watch = onChange(state, render);

export default watch;
