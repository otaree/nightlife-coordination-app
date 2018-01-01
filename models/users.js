var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    twitter: {
        id: String
    }
});

module.exports = mongoose.model('User', User);