import { postData } from '../utils/utils.js';

const validate = {
    patterns: {
        alphanum: /(?=.*[a-zA-Z0-9])/,
        lowercase: /(?=.*[a-z])/,
        uppercase: /(?=.*[A-Z])/,
        symbol: /(?=.*[!@#\$%\^&\*])/,
        length: /(?=.{8,})/
    },
    test(password) {
        return Object.keys(this.patterns).reduce(this._valid(password), {});
    },
    _valid (pw) { 
        return (acc, curr) => ({...acc, [curr]: this.patterns[curr].test(pw)})
    },
    password(pw) {
        const pattern = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
        
        return pattern.test(pw);
    },
    match: (x, y) => x === y
};

export {
    validate
};