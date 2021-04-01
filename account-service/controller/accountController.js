const Account = require('../model/account');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const constants = require('../../common/enum/constants');
const util = require('../../common/util');

//middle ware
module.exports.createAccount = async(req, res, next) => {
    const {error, value} = validators.cAccount(req.body);
    if(error) return res.status(400).send({...codes.BAD_REQUEST[constants[req.language]], message: error.message});
    try{
        await util.checkPermission(req,'account','create');
        const hashPwd = await util.generateHashPwd(value.password);
        value.password = hashPwd;
        const acount = await Account.create(value);
        res.send({...codes.SUCCESS[req.language], data: acount})
    }
    catch(err) {
        console.error(err);
        res.status(400).send(err)
    }
}

module.exports.signUpNormalAccount = (req,res)=>{
    const {error, value} = validators.registerValidator(req.body);
    if(error) return res.status(400).send({message: error.stack});
    util.generateHashPwd(value.password)
    .then(hashPwd =>{
        value.password = hashPwd;
        value.type = 'user';
        value.roles = ['user']
        return Account.create(value);
    })
    .then(account =>{
        res.send({...codes.SUCCESS[req.language], data: account})
    })
    .catch(err =>{
        console.error(err);
        res.status(400).send({message: err.stack});
    })
}

module.exports.getAccount = (req, res) => {
    const userData = {...req.token.user.toObject()};
    delete userData.password
    res.send({...codes.SUCCESS[req.language], data: userData})
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