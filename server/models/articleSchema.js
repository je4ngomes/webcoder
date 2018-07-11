const moongose = require('mongoose');
const Schema = moongose.Schema;

const articleSchema = Schema({
    title: {
        type: String,
        trim: true,
        max: 60,
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    status: { type: String, required: true, default: 'public' },
    createdAt: {type: Number, required: true},
    createdBy: {type: String, required: true},
    AllowComments: {type: Boolean, required: false},
    comments: [{
        comment: {type: Number, required: true, trim: true},
        createdAt: {type: Number, required: true},
        createdBy: {type: String, required: true}
    }],
    images: [{
        contentType: String,
        filename: String,
        data: Buffer
    }]
});

module.exports = articleSchema;