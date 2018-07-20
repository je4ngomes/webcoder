const userRoute = require('express').Router();
const path = require('path');

const postsRoute = require('./posts.route');
const { User } = require('../../models');
const auth = require('../../middlewares/auth');

userRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'dashboard';
    next();
});


userRoute.use(auth.isAuthenticated);

//child routers
userRoute.use('/posts', postsRoute);

userRoute.get('/dashboard', (req, res) => {
    res.render('user/dashboard', {
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
});

userRoute.get('/profile', (req, res) => {

});

userRoute.get('/settings', (req, res) => {

});



module.exports = userRoute;
