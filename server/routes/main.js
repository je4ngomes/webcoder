const route = require('express').Router();
const path = require('path');


route.get('/about', (req, res) => {
    res.render('about');
});

route.get('/', (req, res) => {
    res.render('home');
});



module.exports = route;