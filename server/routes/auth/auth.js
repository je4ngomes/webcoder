const authRoute = require('express').Router();
const jwt = require('jsonwebtoken');
const validator = require('express-joi-validation')({ passError: true });

const transporter = require('../../config/mailer.config');
const passport = require('../../config/passport.config');
const { User } = require('../../models');
const { loginSchema, registerSchema } = require('../../validations/user');
const { checkExistence, genToken } = require('../../utils/utils');

authRoute.all('*', (req, res, next) => {
    req.app.locals.layout = '';
    next();
});

authRoute.get('/', (req, res) => {
    res.render('auth/login');
});

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

authRoute.post(
    '/login',
    validator.body(loginSchema),
    (req, res, next) => {
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
                    return res.redirect(redirectTo || '/admin/dashboard');
                res.redirect(redirectTo || '/user/dashboard');
            });
        })(req, res, next);
    }
);

authRoute.post('/register', validator.body(registerSchema), (req, res) => {

    const user = new User({
        name: {
            first: req.body.first_name,
            last: req.body.last_name
        },
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    
    user.save()
        .then(user => {
            if (!user) {
                return res.boom.badImplementation();
            }
            
            req.logIn({ 
                firstname: user.name.first, 
                lastname: user.name.last, 
                username: user.username,
                isAdmin: user.isAdmin,
                id: user._id 
            }, (err) => {
                res.redirect('/auth/confirmation');
            });
        })
        .catch(err => res.boom.badImplementation());

});

authRoute.get('/confirmation', isAccountConfirmed, (req, res) => {
    
    User.findById(req.user.id)
        .then(user => {
            transporter.sendMail({
                from: process.env.MAILER_EMAIL,
                to: user.email,
                subject: 'webcoder email confirmation',
                html: `<p>Hello ${user.name.first}, 
                please click in the link bellow to confirmated 
                your email address: 
                <a href="http://localhost:3000/auth/confirmation/${genToken(user._id, process.env.MAIL_SECRET)}">link</a></p>`
            })
            .then(info => {
                console.log('Message sent: %s', info.messageId);
                res.render('auth/confirmation');
            })
            .catch(err => console.error(err));            
        });
});

authRoute.get('/confirmation/:token', isAccountConfirmed, (req, res) => {
    const TOKEN = req.params.token;
    const { data: userId } = jwt.verify(TOKEN, process.env.MAIL_SECRET);

    User.findByIdAndUpdate(userId, { $set: { confirmed: true }}).then(user => {
        if (!user)
            return res.boom.notFound('User not found.');
        res.redirect('/');
    })
    .catch(err => res.boom.badImplementation());
});


authRoute.post('/check/username', (req, res) => {
    
    checkExistence('username', req.body.username)
        .then(username => {
            if (username) {
                return res.boom.badRequest('Username already used.');
            }

            res.status(200).send({});
        })
        .catch(err => res.boom.badImplementation());
});

authRoute.post('/check/email', (req, res) => {
    const { email } = req.body;

    checkExistence('email', email)
        .then(email => {
            
            if (email) {
                return res.boom.badRequest('Email already used.');
            }
            
            res.status(200).send({});
        })
        .catch(err => res.boom.badImplementation());
});

authRoute.use((err, req, res, next) => {
    if (err.error.isJoi) {
        return res.status(400).json({
            type: err.type.body,
            message: 'fields has some invalid values'
        });
    }
    next(err);
});

module.exports = authRoute;


