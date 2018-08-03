const mainRoute = require('express').Router();
const validator = require('express-joi-validation')();

const { mainCtrl } = require('../controllers');
const { ObjectId } = require('../validators/post.valid');

mainRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

mainRoute
    .get('/', mainCtrl.renderHomePage)
    .get('/posts', mainCtrl.renderPostsPage)
    .get('/posts/view', validator.query(ObjectId),mainCtrl.renderViewPage)
    .get('/about', mainCtrl.renderAboutPage)
    .get('/logout', mainCtrl.logOut);


module.exports = mainRoute;