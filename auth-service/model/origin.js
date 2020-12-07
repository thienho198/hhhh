const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {type: String},
    origin_url: {type: String}
})

module.exports = mongoose.model('origin', schema);