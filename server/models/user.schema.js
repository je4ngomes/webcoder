const moongose = require('mongoose');
const bcrypt = require('bcrypt');
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
    confirmed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.statics.findByCredentials = function(username, password) {
    const User = this;

    return User.findOne({ username })
        .then(user => {
            if (!user) return Promise.reject();

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result)
                            return resolve(result);
                        reject();
                    });
            });
        });    
};

userSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        return bcrypt.genSalt(10)
            .then(salt => 
                bcrypt.hash(user.password, salt)
                    .then(hash => {
                        user.password = hash;
                        next();
                    })
            );
    }
    next();
});

module.exports = userSchema;