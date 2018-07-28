import { posts as selectors } from '../lib/selectors.js';
import { getElement, getElements, formatObj, isEmpty } from '../utils/utils.js';


const submitForm = (callback, url) => event => {
    event.preventDefault();
    
    const allowComments = getElement(selectors.allowComments).checked;
    const formData = new FormData(getElement(selectors.postForm) || getElement(selectors.editForm));
    formData.set('allowComments', allowComments);

    if (event.target.className === 'post__form') {
        const file = formData.get('coverPhoto');
        const label = getElement(selectors.coverLabel);

        if (!file) {
            label.id = 'required';
            setTimeout(() => label.id = '', 1000);
        }
    }
    
    callback(url, formData)
        .then(res => {
            if (res.status !== 200) 
                return Promise.reject(res);
            
            window.location.href = '/users/posts';
        })
        .catch(err => console.error(err));
    
};

const updateUIForm = (coverPhoto) => {
    const file = coverPhoto.files[0];
    const label = getElement(selectors.coverLabel);

    if (file.name.length >= 15) {
        const slice = Math.floor(file.name.length / 2);
        label.textContent = `...${file.name}`;
        return;
    }
    label.textContent = file.name;
};

export {
    submitForm,
    updateUIForm
};