import { posts as selectors } from '../lib/selectors.js';
import { postData, getElement, getElements, formatObj } from '../utils/utils.js';


// getElement(selectors.postForm)
//     .addEventListener('submit', (e) => {
//         e.preventDefault();
//         const body = getElements(selectors.fields)
//             .reduce(formatObj({ inputValue: true }));
//         const allowComments = getElement(selectors.allowComments).checked;

//         postData('/user/posts/create', {...body, allowComments})
//             .then(res => {
//                 if (res.status === 200 && res.redirected) {
//                     return window.location.href = res.url;
//                 }
//                 return Promise.reject(res);
//             })
//             .catch(err => console.error(err));
    
// });

const movers = 
    [...document.querySelectorAll('.btn__prev, .btn__next')];

const isPageMoveDefined = (element) => {
    const page = element.firstChild.getAttribute('href')
        .split('=')[1];

    return (page === '' ? undefined : page);
};

const disableBtn = (btn) => {
    if (!isPageMoveDefined(btn)) {
        btn.classList.add('disabled');
        btn.firstChild.removeAttribute('href');
    }
};

movers.map(disableBtn);