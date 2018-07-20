const env = require('./env');
const transporter = require('./mailer.config');
const passport = require('./passport.config');


module.exports = {
    env,
    transporter,
    passport
};