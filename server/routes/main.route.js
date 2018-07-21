const mainRoute = require('express').Router();
const { mainCtrl } = require('../controllers');

mainRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

mainRoute
    .get('/', mainCtrl.renderHomePage)
    .get('/posts', mainCtrl.renderPostsPage)
    .get('/about', mainCtrl.renderAboutPage)
    .get('/logout', mainCtrl.logOut);


module.exports = mainRoute;