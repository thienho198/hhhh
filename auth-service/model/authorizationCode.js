const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    authorization_code: {type: String},
    expires_at: {type: Date},
    scope: {type:String},
    client_id: {type:String},
    user_id: {type:mongoose.SchemaTypes.ObjectId},
    redirect_uris: {type:String},
},{timestamps:true});

schema.index({authorization_code: 1}, {unique: true});

module.exports = mongoose.model('authorizationCode', schema);