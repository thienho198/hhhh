const Role = require('../model/role');
const validators = require('../../common/util/validator');
const utils = require('../../common/util');
const codes = require('../../common/enum/codes');


module.exports.create = async(req, res, next) => {
    if(body = utils.checkValidBody(req, res, validators.cRole)){
        try {
            await utils.checkPermission(req, 'role', 'create');  
            const result = await Role.create(body);
            res.send({...codes.SUCCESS[req.language], data: result});
        }
        catch(err) {
            console.log(err);
            res.status(400).send({...codes.SYSTEM_ERROR[req.language], error: err.message})
        }
    }
}

module.exports.read = async(req, res, next)=>{
    try {
        await utils.checkPermission(req,'role', 'read');
        const result = await Role.find();
        res.send({...codes.SUCCESS[req.language], data: result});
    }
    catch(err) {
        console.log(err);
        res.status(400).send({...codes.SYSTEM_ERROR[req.language], error: err.message})
    }
}