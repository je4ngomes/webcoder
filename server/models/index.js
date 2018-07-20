const mongoose = require('../config/db/connection');

const userSchema = require('./user.schema');
const articleSchema = require('./article.schema');

const User = mongoose.model('user', userSchema);
const Article = mongoose.model('article', articleSchema);

module.exports = {
    User,
    Article
};