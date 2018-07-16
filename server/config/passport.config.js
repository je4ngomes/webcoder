const passport = require('passport');
const LocalStratety = require('passport-local').Strategy;

const { User } = require('../models');

const serialization = (user, done) => done(null, user);

passport.serializeUser(serialization);
passport.deserializeUser(serialization);
passport.use(new LocalStratety((username, password, done) => {
        const errorMsg = 'Invalid username or password.';

        User.findOne({ username })
            .then(user => {
                if (!user) 
                    return done(null, false, errorMsg);
                
                User.findByCredentials(username, password)
                    .then(result => {
                        if (result) done(null, user);
                    })
                    .catch(err => done(null, user, errorMsg));
        })
        .catch(err => console.log(err) && done(err));

    }
));

module.exports = passport;