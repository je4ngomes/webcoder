const moongose = require('mongoose');
const Schema = moongose.Schema;

const articleSchema = Schema({
    title: {
        type: String,
        trim: true,
        max: 60,
        required: true
    },
    _id: String,
    body: {
        type: String,
        required: true
    },
    status: { type: String, required: true, default: 'public' },
    createdAt: {type: Number, required: true},
    createdBy: {type: Schema.Types.ObjectId, required: true},
    allowComments: {type: Boolean, required: false},
    comments: [{
        comment: {type: String, required: true},
        createdAt: {type: Number, required: true},
        createdBy: {type: Schema.Types.ObjectId, required: true}
    }]
}, {_id: false});

module.exports = articleSchema;