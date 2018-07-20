const Joi = require('joi');

const postSchema = Joi.object({
    postTitle: Joi.string().trim().empty().required(),
    postBody: Joi.string().min(50).required(),
    allowComments: Joi.bool().required(),
    status: Joi.string().required()
});

module.exports = postSchema;