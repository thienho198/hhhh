const validators = require('../../common/util/validator');
const utils = require('../../common/util');
const AuthorizationCode = require('../model/authorizationCode');

module.exports.create = (data) => {
    try {
        const value = utils.checkValidBodyNotRes(data, validators.cAuthorizationCode);
        return AuthorizationCode.create(value);
    }
    catch(err) {
        throw err;
    }
    
}

module.exports.get = (code) =>{
    try {
        return AuthorizationCode.findOne({authorization_code: code});
    }
    catch(err) {
        throw err;
    }
}