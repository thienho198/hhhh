const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title:{type: String},
    subject:{type: String},
    overview:{type: String},
    publisher:{type: String},
    author:{type: String},
    lang:{type: String}
},{
    timestamps: true
})

module.exports = mongoose.model('book',schema);