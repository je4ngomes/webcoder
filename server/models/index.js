const mongoose = require('../config/db/connection');

const userSchema = require('./user.schema');
const loginSchema = require('./login.schema');
const commentSchema = require('./comment.schema');
const articleSchema = require('./article.schema');

const User = mongoose.model('user', userSchema);
const Login = mongoose.model('login', loginSchema);
const Comment = mongoose.model('comment', commentSchema);
const Article = mongoose.model('article', articleSchema);

module.exports = {
    User,
    Comment,
    Login,
    Article
};