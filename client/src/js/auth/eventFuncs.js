import { validate } from './validation.js';
import {login as selectors} from '../lib/selectors.js';
import { 
    postData,
    getElement,
    formatObj,
    isEmpty,
    getQueryFrom,
    isValidRedirection,
    getElements
} from '../utils/utils.js';


const changeColor = ([part, ...remaining], domObj) => {
    const [key, value] = part;

    value 
        ? domObj[key].style.color = '#52ff61' 
        : domObj[key].style.color = '#ff6a6a';

    if (isEmpty(remaining)) {
        return { done: true };
    }

    return changeColor(remaining, domObj);
};

const validPassword = () => {
    const 
        letters = getElement(selectors.signup).querySelector(selectors.inputPassword).value,
        results = validate.test(letters);

    const 
        requirements = getElements(selectors.requirements),
        regfields = requirements.reduce(formatObj({ inputValue: false }), {});
  
    changeColor(Object.entries(results), regfields);
};

const changeOpacity = (opacity) => {
    getElement('.arrow__box')
        .style.opacity = opacity;
}

const submitRegister = (e) => {
    e.preventDefault();

    const body = getElements(selectors.signupInput)
        .reduce(
            formatObj({ inputValue: true }
        ), {});

    const {
        password, passwordConf,
        username, email
    } = body

    const jsonresults = [
        postData('/auth/check/username', {username}),
        postData('/auth/check/email', {email})
    ].map(result => result.then(res => res.json()));
    
    Promise.all(jsonresults)
        .then(results => {
            // check if statusCode exist
            // check if statusCode isn't 200
            const errors = results
                .filter(result => 
                        result.statusCode ?
                        result.statusCode !== 200 :
                        false   
                );

            if (errors.length > 0) {
                throw errors;
            }
        })
        .then(_ => {
            if (validate.password(password) && validate.match(password, passwordConf)) {
                postData('auth/register', JSON.stringify(body), {'content-type': 'application/json'})
                    .then(res => {
                        if (isValidRedirection(res)) {
                            window.location.href = res.url;
                        }
                    })
                    .catch(err => console.error(err));
            }
        })
        .catch(err => 
            console.error(err)
        );
};

const submitLogin = (e) => {
    e.preventDefault();

    const body = getElements(selectors.signinInput)
        .reduce(
            formatObj({ inputValue: true }
        ), {});

    const query = getQueryFrom(window.location.href); // ?query=

    postData(`auth/login${query}`, JSON.stringify(body), {'Content-type': 'application/json'})
        .then(async res => {
            if (res.bodyUsed)
                throw await res.json();
            return res;
        })
        .then(res => {
            if (isValidRedirection(res)) {
                window.location.href = res.url;
            }
        })
        .catch(err => console.error(err));
}

const toggleElements = () => {
    getElement(selectors.signin).classList.toggle('disabled');
    getElement(selectors.signup).classList.toggle('disabled');
};

const toggleForm = (element) => 
    element.addEventListener('click', toggleElements);

export {
    validPassword,
    changeOpacity,
    submitLogin,
    toggleForm,
    submitRegister
};