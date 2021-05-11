const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    role:{type: String},
    resource:{type:String},
    action:{type:String},
    attributes:{type:String, default:'*'}
},{
    timestamps: true
});

schema.index({ role: 'text',resource:'text'});

module.exports = mongoose.model('role', schema);
