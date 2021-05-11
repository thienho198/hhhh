const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {type: String},
    parentId: {type: String},
    position:{type:String},
    isActive: {type: Boolean, default: true},
    isRoot: {type: Boolean, default: false},
    requiredTypes: {type:[{type: mongoose.Types.ObjectId, ref:'type'}], default:[]},
},{
    timestamps: true
})
schema.index({name:'text'})
schema.index({position:1}, {unique: true})
module.exports = mongoose.model('menu',schema);