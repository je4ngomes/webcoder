const userRoute = require('express').Router();
const path = require('path');

const postsRoute = require('./posts');
const { User } = require('../../models');

userRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'dashboard';
    next();
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return User.findById(req.user.id)
            .then(user => {
                if (!user.confirmed) {
                    return res.redirect('/auth/confirmation');
                }
                next();
        });
    }
    res.redirect(`/auth?redirectTo=${req.originalUrl}`);
};

userRoute.use(isAuthenticated);

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
