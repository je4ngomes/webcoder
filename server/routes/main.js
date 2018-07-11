const mainRoute = require('express').Router();
const validator = require('express-joi-validation')({
    passError: true
});
const path = require('path');

const { User } = require('../models');
const { loginSchema } = require('../validations/user');
const { isEqual } = require('../utils/utils');

mainRoute.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

mainRoute.get('/', (req, res, next) => {
    res.render('home/home');
});

mainRoute.get('/posts', (req, res) => {

});

mainRoute.get('/login', (req, res) => {
    req.app.locals.layout = '';
    res.render('auth/login');
});

mainRoute.post('/login', validator.body(loginSchema), (req, res) => {
    console.log(req.body);
});

mainRoute.post('/register', (req, res) => {
    console.log(req.body);
});


mainRoute.get('/about', (req, res) => {
    res.render('home/about');
});


mainRoute.use((err, req, res, next) => {
  if (err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      message: err.error.toString()
    });
  } else {
    // pass on to another error handler
    next(err);
  }
});


module.exports = mainRoute;