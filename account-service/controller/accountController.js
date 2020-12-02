const Account = require('../model/account');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const constants = require('../../common/enum/constants');
const util = require('../../common/util');

//middle ware
module.exports.createAccount = (req, res, next) => {
    const {error, value} = validators.registerValidator(req.body);
    if(error) return res.send(codes.BAD_REQUEST[constants[req.language]]);
    util.generateHashPwd(value.password)
    .then((hashPwd) => {
        value.password = hashPwd;
        Account.create(value, (err, result) => {
            err ? res.send({...codes.SYSTEM_ERROR, message: err.stack}) : res.send({...codes.SUCCESS[req.language], data: result})
        })
    })
    .catch((err) =>{
        console.log(err);
        res.send({...codes.SYSTEM_ERROR, message: err.stack});
    })
}

//functions
module.exports.authenticateUser = async(username, password)=>{
    try {
        const user = await Account.findOne({email: username});
        const result = await util.checkHashPwd(password, user.password);
        return Promise.resolve({authenticate: result, user: user});
    }
    catch(err) {
        console.log(err);
        return Promise.reject(err);
    }
}