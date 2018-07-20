const jwt = require('jsonwebtoken');

const { User } = require('../models');

const genToken = (data, secret) => {
    return jwt.sign({
        data
    }, secret, { expiresIn: '1d' });
};
const checkExistence = (type, value) => User.findOne({ [type]: value });

module.exports = {
    genToken,
    checkExistence
};