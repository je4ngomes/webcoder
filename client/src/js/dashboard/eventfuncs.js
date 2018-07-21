import { posts as selectors } from '../lib/selectors.js';
import { getElement, getElements, formatObj } from '../utils/utils.js';


const submitForm = (callback, url) => event => {
    event.preventDefault();
    const body = getElements(selectors.fields)
        .reduce(formatObj({ inputValue: true }), {});
    const allowComments = getElement(selectors.allowComments).checked;

    callback(url, {...body, allowComments})
        .then(res => {
            if (!(res.status === 200)) 
                return Promise.reject(res);
            
            window.location.href = '/users/posts';
        })
        .catch(err => console.error(err));
    
};

export {
    submitForm
};