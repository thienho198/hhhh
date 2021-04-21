const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {type: String},
    parentId: {type: String},
    isActive: {type: Boolean, default: true},
    requiredTypes: {type:[{type: mongoose.Types.ObjectId, ref:'type'}], default:[]},
},{
    timestamps: true
})

module.exports = mongoose.model('menu',schema);