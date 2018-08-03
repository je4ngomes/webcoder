import { posts as selectors } from '../lib/selectors.js';
import { submitForm, updateUIForm } from './eventfuncs.js';
import { updateData, getElement, autoExpand } from '../utils/utils.js';



window.onload = () => {
    autoExpand(textarea);
}

getElement(selectors.editForm)
    .addEventListener('submit', submitForm(updateData, window.location.href));


const textarea = getElement('.post_body');
textarea.addEventListener('keydown', autoExpand);

const coverPhoto = getElement(selectors.postCover)
coverPhoto
    .addEventListener('change', updateUIForm.bind(null, coverPhoto));