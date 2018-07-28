const moongose = require('mongoose');
const Schema = moongose.Schema;

const articleSchema = Schema({
    title: {
        type: String,
        trim: true,
        max: 60,
        required: true
    },
    body: {type: String, required: true},
    description: { type: String, max: 100, required: true },
    coverPic: String,
    coverPicID: String,
    status: { type: String, required: true, default: 'public' },
    createdAt: {type: Date, default: Date.now(), required: true},
    createdBy: {type: Schema.Types.ObjectId, required: true},
    allowComments: {type: Boolean,  default: false,required: true},
    comments: [Schema.Types.ObjectId]
});

module.exports = articleSchema;