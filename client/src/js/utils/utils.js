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

const pipe = (funcs) => arg => funcs.reduce((prev, curr) => curr(prev), arg);
// if className doesn't exist use element name as key
// Only return elements value if `value` is equal to true
const formatObj = 
    (value=false) => 
        (acc, curr) => ({
            ...acc, 
            [curr.className || curr.name]: value ? curr.value : curr
        });

const isEmpty = (target) => target.length === 0;
const getElement = (element) => document.querySelector(element);
const getElements = (elements) => [...document.querySelectorAll(elements)];

export {
    isEmpty,
    getElement,
    getElements,
    formatObj,
    pipe,
    postData
};