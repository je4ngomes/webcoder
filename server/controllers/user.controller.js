const renderDashboardPage = (req, res) => {
    res.render('user/dashboard', {
        firstname: req.user.firstname,
        lastname: req.user.lastname
    });
};

const renderProfilePage = (req, res) => {

};

const renderSettingsPage = (req, res) => {

};


module.exports = {
    renderDashboardPage,
    renderProfilePage,
    renderSettingsPage
};