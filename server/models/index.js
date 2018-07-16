const mongoose = require('../config/db/connection');

const userSchema = require('./userSchema');
const articleSchema = require('./articleSchema');

const User = mongoose.model('user', userSchema);
const Article = mongoose.model('article', articleSchema);


module.exports = {
    User,
    Article
};