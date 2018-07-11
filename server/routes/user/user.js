const userRoute = require('express').Router();
const path = require('path');

const postsRoute = require('./posts');

userRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'dashboard';
    next();
});

//child routers
userRoute.use('/posts', postsRoute);

userRoute.get('/dashboard', (req, res) => {
    res.render('user/dashboard');
});

userRoute.get('/profile', (req, res) => {

});

userRoute.get('/settings', (req, res) => {

});



module.exports = userRoute;
