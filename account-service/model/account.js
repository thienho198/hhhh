const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    phone: {type: String},
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    birthday: {type: Date},
    isDeleted:{type:Boolean, default: false},
    password: {type: String},
    type: {type:mongoose.Types.ObjectId,ref:'type'}
},{
    timestamps: true
});

schema.index({email: 1}, {unique: true});
schema.index({ phone: 'text',email:'text', firstName:'text', lastName:'text'});

module.exports = mongoose.model('account', schema);
