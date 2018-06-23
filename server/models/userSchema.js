const moongose = require('mongoose');
const Schema = moongose.Schema;

const userSchema = Schema({
    name: {
        first: { type: String, trim: true, required: true },
        last:  { type: String, trim: true, required: true }
    },
    username: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        min: 8,
        max: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator(isValidEmail){
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(isValidEmail);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = userSchema;