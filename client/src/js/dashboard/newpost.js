import { posts as selectors } from '../lib/selectors.js';
import { submitForm } from './eventfuncs.js';
import { postData, getElement } from '../utils/utils.js';


getElement(selectors.postForm)
    .addEventListener('submit', submitForm(postData, '/users/posts/create'));