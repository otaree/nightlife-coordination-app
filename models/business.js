var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Business = new Schema({
    business_id: String,
    users: [{type: Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model("Business", Business);