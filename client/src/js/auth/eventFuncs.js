import { validate } from './validation.js';
import selectors from './selectors.js';
import { 
    postData,
    getElement,
    formatObj,
    isEmpty,
    getElements
} from '../utils/utils.js';

const changeColor = ([part, ...remaining], domObjs) => {
    const [key, value] = part;

    value 
        ? domObjs[key].style.color = '#52ff61' 
        : domObjs[key].style.color = '#ff6a6a';

    if (isEmpty(remaining)) {
        return true;
    }

    return changeColor(remaining, domObjs);
};

const validPassword = () => {
    const 
        letters = getElement(selectors.signup).querySelector(selectors.inputPassword).value,
        results = validate.test(letters);

    const 
        requirements = getElements(selectors.requirements),
        regfields = requirements.reduce(formatObj(), {});
  
    changeColor(Object.entries(results), regfields);
};

const changeOpacity = (opacity) => {
    getElement('.arrow__box')
        .style.opacity = opacity;
}

const submitRegister = (e) => {
    const body = getElements(selectors.signupInput)
        .reduce(formatObj(true), {});
    console.log(registerForm.checkValidity());
    //postData('/register', pipe([getReg]))

    e.preventDefault();
};

const submitLogin = (e) => {
    const body = getElements(selectors.signinInput)
        .reduce(formatObj(true), {});

    postData('/login', body)
        .then(res => res.json())
        .then(result => console.log(result))
        .catch(err => console.error(err));

    e.preventDefault();
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