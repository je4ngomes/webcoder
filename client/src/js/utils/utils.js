const postData = (url, body) => {
    return fetch(url, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

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

export {
    isEmpty,
    getElement,
    getElements,
    getQueryFrom,
    formatObj,
    isValidRedirection,
    pipe,
    postData
};