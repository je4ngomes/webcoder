const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/webcoder');

module.exports = mongoose;