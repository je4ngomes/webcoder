const { passport } = require('../config');
const { User } = require('../models');

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

const isAccountConfirmed = (req, res, next) => {
    if (req.isAuthenticated()) {
        return User.findById(req.user.id)
            .then(user => {
                if (user.confirmed) {
                    return res.redirect('/');
                }
                next();
        });
    }
    res.redirect(`/auth`);
};

const authenticate = (req, res, next) => {
    const redirectTo = req.query.redirectTo;

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return res.boom.badRequest('Unable to authenticate. Please try again.');
        if (info)
            return res.boom.unauthorized(info);
        
        req.logIn({ 
            firstname: user.name.first, 
            lastname: user.name.last, 
            username: user.username,
            isAdmin: user.isAdmin,
            id: user._id 
        }, (err) => {
            if (err) 
                return next(err);
            if (user.isAdmin) 
                return res.redirect(redirectTo || '/admins/dashboard');
            res.redirect(redirectTo || '/users/dashboard');
        });
    })(req, res, next);
}


module.exports = {
    isAccountConfirmed,
    isAuthenticated,
    authenticate
};