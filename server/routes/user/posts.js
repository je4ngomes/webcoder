const express = require('express');
const postRoute = express.Router();

const { toBoolean } = require('../../utils/utils');
//const { Post } = require('../../models');

postRoute.get('/', (req, res) => {
    res.render('user/posts/posts', {
        current: 1,
        limit: 10,
        prev: undefined,
        next: 2,
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
});

postRoute.get('/create', (req, res) => {
    res.render('user/posts/newpost', {
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
});

postRoute.get('/edit', (req, res) => {
    res.render('user/posts/updatepost');
});

postRoute.post('/create', (req, res) => {

});

module.exports = postRoute;