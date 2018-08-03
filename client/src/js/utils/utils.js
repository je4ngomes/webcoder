import { posts as selectors } from '../lib/selectors.js';

const postData = (url, body, headers = {}) => {
    return fetch(url, {
        method: "POST",
        mode: 'cors',
        body: body,
        headers
    });
};

const deleteData = (url) => fetch(url, { method: 'DELETE', mode: 'cors' });
const updateData = (url, body) => {
    return fetch(url, {
        method: "PUT",
        mode: 'cors',
        body: body
    });
}

const isValidRedirection = (res) => res.status === 200 && res.redirected;

const pipe = (funcs) => arg => funcs.reduce((prev, curr) => curr(prev), arg);
// if className doesn't exist use element name as key
// Only return elements value if `value` is equal to true
const formatObj = 
    ({ inputValue }) => 
        (acc, curr) => ({
            ...acc, 
            [curr.name || curr.className]: inputValue ? curr.value : curr
        });

const isEmpty = (target) => target.length === 0;
const getElement = (element) => document.querySelector(element);
const getElements = (elements) => [...document.querySelectorAll(elements)];
const getQueryFrom = (url) => {
    const query = /\?[a-zA-Z]+=.*/.exec(url) || '';

    if (!query) return query;
    return query[0];
};

const autoExpand = (element) => {
    const field = element.target || element;

	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	const computed = window.getComputedStyle(field);

	// Calculate the height
	const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';
};


const resizeDescription = () => {
    const descriptions = getElements('.article__description');
    const greaterThan = descriptions.filter(el => el.textContent.length > 75);

    greaterThan.forEach(el => 
        (el.textContent = el.textContent.slice(null, 75) + '...')
    );
};


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

const pagination = () => {

    const movers = getElements(selectors.prevAndNext);
    movers.map(disableBtn);

};





export {
    isEmpty,
    getElement,
    getElements,
    getQueryFrom,
    formatObj,
    deleteData,
    isValidRedirection,
    pipe,
    pagination,
    resizeDescription,
    autoExpand,
    updateData,
    postData
};