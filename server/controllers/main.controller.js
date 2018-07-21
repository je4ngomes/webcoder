

const renderHomePage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('home/home', {
            isLogged: req.isAuthenticated(),
            dashboardLink: req.user.isAdmin ? 
                '/admins/dashboard' : 
                '/users/dashboard'
        });
    }
    res.render('home/home');

}

const renderPostsPage = (req, res) => {

};

const renderAboutPage = (req, res) => {
    res.render('home/about');
};

const logOut = (req, res) => {
    req.logOut();
    res.redirect('/')
};

module.exports = {
    renderHomePage,
    renderPostsPage,
    renderAboutPage,
    logOut
};