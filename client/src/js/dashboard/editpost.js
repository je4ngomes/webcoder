import { posts as selectors } from '../lib/selectors.js';
import { submitForm } from './eventfuncs.js';
import { updateData, getElement } from '../utils/utils.js';


getElement(selectors.editForm)
    .addEventListener('submit', submitForm(updateData, window.location.href));