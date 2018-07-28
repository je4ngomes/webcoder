const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const { passport, transporter } = require('../config');
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

const sendEmailConfirmation = async (req, res, next) => {
    const token = await promisify(jwt.sign(
        {data: req.user.id}, 
        process.env.MAIL_SECRET, 
        { expiresIn: '24h' }
    ));

    User.findById(req.user.id)
        .then(user => {
            transporter.sendMail({
                from: process.env.MAILER_EMAIL,
                to: user.email,
                subject: 'webcoder email confirmation',
                html: `<p>Hello ${user.name.first}, 
                please click in the link bellow to confirmated 
                your email address: 
                <a href="http://localhost:3000/auth/confirmation/${token}">
                link</a></p>`
            })
            .then(info => {
                console.log('Message sent: %s', info.messageId);
                next();
            })
            .catch(err => {
                console.error(err)
                res.boom.badImplementation();
            });            
        });
};


const validTokenConfirmation = async (req, res, next) => {
    const TOKEN = req.params.token;
    try {

        const { data: userId } = await promisify(jwt.verify(TOKEN, process.env.MAIL_SECRET));

    } catch(err) {

        switch(err.name) {
            case 'TokenExpiredError':
                return res.boom
                    .badRequest('Token has expired, please re-login to receive another email.');

            case 'JsonWebTokenError':
                return res.boom
                    .badRequest(`${TOKEN} is not a valid token.`);
        }

    }

    User.findByIdAndUpdate(userId, { $set: { confirmed: true }})
        .then(user => {
            if (!user)
                return res.boom.notFound('User not found.');
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};


module.exports = {
    isAccountConfirmed,
    isAuthenticated,
    sendEmailConfirmation,
    validTokenConfirmation,
    authenticate
};