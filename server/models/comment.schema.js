const moongose = require('mongoose');
const Schema = moongose.Schema;

const commentSchema = Schema({
    comment: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), required: true},
    createdBy: {type: Schema.Types.ObjectId, required: true}
});


module.exports = commentSchema;