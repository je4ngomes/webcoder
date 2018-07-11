const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
    firstname: Joi.string().empty().trim().required(),
    lastname: Joi.string().empty().trim().required(),
    username: Joi.string().trim().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required()
});

module.exports = {
    loginSchema,
    registerSchema
};
