const env = require('./env');
const transporter = require('./mailer.config');
const passport = require('./passport.config');
const session = require('./session.config');


module.exports = {
    env,
    transporter,
    session,
    passport
};