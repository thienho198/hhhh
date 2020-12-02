const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    grants:[{type: String}],
    client_secret:{type:String},
    redirect_uris: [{type:String}],
    name: {type:String}
})

module.exports = mongoose.model('client', schema);