const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = Schema({
    indentityKey: {
        type: String,
        require: true,
        unique: true
    },
    failedAttempts: {
        type: Number,
        require: true,
        default: 0
    },
    timeout: {
        type: Date,
        require: true,
        default: new Date()
    }
});


loginSchema.statics.failedLoginAttempt = function(indentityKey) {
    const Login = this;
    const
        query = { indentityKey },
        update = {
            $inc: {failedAttempts: 1}, 
            $set: {
                    timeout: Date.now(), 
                    inProgress: false
                }
            },
        options = {setDefaultOnInsert: true, upsert: true}
    
    return Login.update(query, update, options);
};

loginSchema.statics.successfulLoginAttempt = function(indentityKey) {
    const Login = this;

    return Login.remove({ indentityKey });
};

module.exports = loginSchema;