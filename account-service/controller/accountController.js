const Account = require('../model/account');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const constants = require('../../common/enum/constants');
const util = require('../../common/util');

//middle ware
module.exports.create = async(req, res, next) => {
    try{
        const hashPwd = await util.generateHashPwd(req.body.password);
        req.body.password = hashPwd;
        const acount = await Account.create(req.body);
        res.send({...codes.SUCCESS[req.language], data: acount})
    }
    catch(err) {
        console.error(err);
        res.status(500).send({message:err.message});
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

module.exports.getList = async (req, res) =>{
    try{
        const {filter,sort,limit,skip,projection} = req.query; 
        let [result,count] = await Promise.all([
            Account.find(filter,projection,{skip:skip,limit:limit,sort:sort}).populate('type').lean(),
            Account.countDocuments(filter)
        ])
        res.send({...codes.SUCCESS[req.language],data:result, count:count})
    }
    catch(err) {
        console.error(err);
        res.status(500).send({message:err.message})
    }
}

module.exports.update = async (req, res) => {
    try{
        const id = req.body.id;
        const accountUpdated = await Account.findByIdAndUpdate(id, req.body, {new:true});
        res.send({...codes.SUCCESS[req.language], data:accountUpdated})
    }
    catch(err) {
        console.log(err);
        res.status(400).send({...codes.SYSTEM_ERROR[req.language], error: err.message}) 
    }
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
