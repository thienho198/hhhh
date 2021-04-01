const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {type: String},
    parentId: {type: String},
    isActive: {type: Boolean},
    requiredRoles: [{type: mongoose.Types.ObjectId, ref:'role'}]
},{
    timestamps: true
})

module.exports = mongoose.model('menu',schema);