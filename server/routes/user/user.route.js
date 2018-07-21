const userRoute = require('express').Router();

const postsRoute = require('./posts.route');
const {userCtrl} = require('../../controllers');
const auth = require('../../middlewares/auth');

userRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'dashboard';
    next();
});

userRoute.use(auth.isAuthenticated);

//child routers
userRoute.use('/posts', postsRoute);

userRoute
    .get('/dashboard', userCtrl.renderDashboardPage)
    .get('/profile', userCtrl.renderProfilePage)
    .get('/settings', userCtrl.renderSettingsPage);


module.exports = userRoute;
