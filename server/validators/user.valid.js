const Joi = require('joi');

const name = Joi.string().empty().trim().required();

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
    first_name: name,
    last_name: name,
    username: Joi.string().trim().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required(),
    passwordConf: Joi.any().valid(Joi.ref('password')).required()
});

module.exports = {
    loginSchema,
    registerSchema
};