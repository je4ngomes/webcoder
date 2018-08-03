const authRoute = require('express').Router();
const jwt = require('jsonwebtoken');
const validator = require('express-joi-validation')({ passError: true });

const { loginSchema, registerSchema } = require('../../validators/user.valid');
const { authCtrl } = require('../../controllers');
const auth = require('../../middlewares/auth');

authRoute.all('*', (req, res, next) => {
    req.app.locals.layout = '';
    next();
});

authRoute
    .get('/', authCtrl.renderLoginPage)
    .get(
        '/confirmation', 
        [auth.isAccountConfirmed, 
        auth.sendEmailConfirmation], 
        authCtrl.renderConfirmationPage
    )
    .get('/confirmation/:token', [auth.isAccountConfirmed, auth.validTokenConfirmation]);

authRoute
    .post('/login',[
        validator.body(loginSchema),
        auth.setIndentityKey,
        auth.checkLoginAttempts, 
        auth.authenticate
    ])
    .post('/register', validator.body(registerSchema), authCtrl.signUp)
    .post('/check/username', authCtrl.validUsername)
    .post('/check/email', authCtrl.validEmail);

authRoute.use((err, req, res, next) => {
    console.log(err)
    if (err.error.isJoi) {
        return res.status(400).json({
            type: err.type.body,
            message: 'fields has some invalid values'
        });
    }
    next(err);
});

module.exports = authRoute;


