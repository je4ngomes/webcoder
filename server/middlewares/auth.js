const jwt = require('jsonwebtoken');

const { passport, transporter } = require('../config');
const { delayResponse, addMinutes } = require('../utils');
const { User, Login } = require('../models');

// if auth redirect user to
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

// verify if use account is already confirmed
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

// authenticate user
const authenticate = (req, res, next) => {
    const redirectTo = req.query.redirectTo;
    const indentityKey = req.indentityKey;

    passport.authenticate('local', async (err, user, info) => {
        if (err) 
            return delayResponse(
                () => res.boom.badRequest('Unable to authenticate. Please try again.')
            );
        
        if (info) {
            // track failled attempts
            await Login.failedLoginAttempt(indentityKey);   

            return delayResponse(
                () => res.boom.unauthorized(info)
            );
        }
        // if  successfully authenticated then log in and remove failed attempts from `Login`        
        Login.successfulLoginAttempt(indentityKey);

        req.logIn({ 
            firstname: user.name.first, 
            lastname: user.name.last, 
            username: user.username,
            isAdmin: user.isAdmin,
            id: user._id 
        }, (err) => {
            if (err) 
                return next(err);

            //regenerate new session
            req.session.regenerate((err) => {
                if (err) {
                    return res.boom.badImplementation();
                }
                req.session.passport = req.user;
            });

            if (user.isAdmin) 
                return res.redirect(redirectTo || '/admins/dashboard');
            
            res.redirect(redirectTo || '/users/dashboard');
        });
    })(req, res, next);
}

// send email confirmation for user be able to log in
const sendEmailConfirmation = (req, res, next) => {
    const token = jwt.sign(
        {data: req.user.id}, 
        process.env.MAIL_SECRET, 
        { expiresIn: '24h' }
    );

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


// Check Login attempts, if it is under X than user can log in, if not return some response to the user
const checkLoginAttempts = (req, res, next) => {

    Login.findOne({ indentityKey: req.indentityKey })
        .then(login => {
            // if login doesn't exist or `failedAttempts` is under 5 call next
            if (!login || login.failedAttempts < 5) return next();

            const timeOut = Date.now() - addMinutes(1, login.timeout);
            // timeOut greater or equals to 0 means the timeOut has expired and the user can log in
            if (timeOut >= 0) {
                return Login.remove({ indentityKey: req.indentityKey })
                    .then(() => next());
            };

            res.boom.badImplementation('User has reached login attempts.');          
            
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });

};

// validate token confirmation
const validTokenConfirmation = async (req, res, next) => {
    const TOKEN = req.params.token;
    try {

        const { data: userId } = jwt.verify(TOKEN, process.env.MAIL_SECRET);

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

const setIndentityKey = (req, res, next) => {
    req.indentityKey = `${req.body.username}-${req.ip}`;
    next();
};


module.exports = {
    isAccountConfirmed,
    isAuthenticated,
    sendEmailConfirmation,
    validTokenConfirmation,
    checkLoginAttempts,
    setIndentityKey,
    authenticate
};