const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{type: String},
    roles: {
        type:[{type:String}],
        default:[]
    }
},{timestamps: true})

module.exports = mongoose.model('type', schema);