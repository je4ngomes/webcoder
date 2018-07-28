const Joi = require('joi');

const postSchema = Joi.object({
    postTitle: Joi.string().trim().empty().required(),
    postDescription: Joi.string().trim().empty().required(),
    postBody: Joi.string().empty().required(),
    allowComments: Joi.bool().required(),
    status: Joi.string().required()
});
const ObjectId = { id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id') };

module.exports = { postSchema, ObjectId };