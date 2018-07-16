const mainRoute = require('express').Router();

mainRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

mainRoute.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('home/home', {
            isLogged: req.isAuthenticated(),
            dashboardLink: req.user.isAdmin ? 
                '/admin/dashboard' : 
                '/user/dashboard'
        });
    }
    res.render('home/home');

});

mainRoute.get('/posts', (req, res) => {

});

mainRoute.get('/about', (req, res) => {
    res.render('home/about');
});

mainRoute.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
})

module.exports = mainRoute;