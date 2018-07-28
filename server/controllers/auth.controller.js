const { User } = require('../models');
const { checkExistence } = require('../utils');


const renderLoginPage = (req, res) => {
    res.render('auth/login');
};

const signUp = (req, res) => {

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
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};

const renderConfirmationPage = (req, res) => res.render('auth/confirmation');

const validUsername = (req, res) => {
    
    checkExistence('username', req.body.username)
        .then(username => {
            if (username) {
                return res.boom.badRequest('Username already used.');
            }

            res.status(200).send({});
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};

const validEmail = (req, res) => {
    const { email } = req.body;

    checkExistence('email', email)
        .then(email => {
            
            if (email) {
                return res.boom.badRequest('Email already used.');
            }
            
            res.status(200).send({});
        })
        .catch(err => {
            console.error(err);
            res.boom.badImplementation();
        });
};

module.exports = {
    renderConfirmationPage,
    renderLoginPage,
    validEmail,
    validUsername,
    signUp
};