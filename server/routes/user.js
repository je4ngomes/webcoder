const route = require('express').Router();
const path = require('path');

route.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/src/user/login.html'));
});

route.get('/dashboard', (req, res) => {
    res.render('user/dashboard');
});

module.exports = route;
