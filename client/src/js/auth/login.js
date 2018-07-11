import { getElements, getElement } from '../utils/utils.js';
import {
    validPassword,
    changeOpacity,
    submitLogin,
    submitRegister,
    toggleForm
} from './eventFuncs.js';
import selectors from './selectors.js';

const loginForm = document.querySelector(selectors.signin);
const registerForm = document.querySelector(selectors.signup);
const regInputPassword = registerForm.querySelector(selectors.inputPassword);

// Create Events for login page
getElements(selectors.registerAndLoginId).map(toggleForm);
loginForm.addEventListener('submit', submitLogin);
registerForm.addEventListener('submit', submitRegister);
regInputPassword.addEventListener('focus', changeOpacity.bind(null, 1));
regInputPassword.addEventListener('blur', changeOpacity.bind(null, 0));
regInputPassword.addEventListener('keyup', validPassword);