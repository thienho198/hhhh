const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    phone: {type: String},
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    birthday: {type: String},
    isRoot:{type: Boolean, default: false},
    isDeleted:{type:Boolean, default: false},
    password: {type: String},
    roles:[{type:String}]
},{
    timestamps: true
});

schema.index({email: 1}, {unique: true});

module.exports = mongoose.model('account', schema);
