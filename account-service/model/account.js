const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    phone: {type: String},
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    birthday: {type: String},
    isDeleted:{type:Boolean, default: false},
    password: {type: String},
    type: {type:mongoose.Types.ObjectId,ref:'type'}
},{
    timestamps: true
});

schema.index({email: 1}, {unique: true});

module.exports = mongoose.model('account', schema);
