const mongoose = require('mongoose');
const model = mongoose.model;

const userSchema = require('./userSchema');
const articleSchema = require('./articleSchema');

const User = model('user', userSchema);
const Article = model('article', articleSchema);


module.exports = {
    User,
    Article
};