const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    refresh_token: {type: String},
    expires_at: {type: Date},
    scope: {type:String},
    client_id: {type: mongoose.SchemaTypes.ObjectId },
    user_id: {type:mongoose.SchemaTypes.ObjectId},
},{timestamps:true});

schema.index({refresh_token: 1}, {unique: true});

module.exports = mongoose.model('refreshToken', schema);