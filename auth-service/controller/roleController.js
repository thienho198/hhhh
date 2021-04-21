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

module.exports.delete = async(req, res, next) => {
    try{
        const id = req.query.id;
        const roleDelete = await Role.findByIdAndDelete(id);
        res.send({...codes.SUCCESS[req.language], data:roleDelete})
    }
    catch(err){
        console.log(err);
        res.status(400).send({...codes.SYSTEM_ERROR[req.language], error: err.message})
    }
}

module.exports.update = async(req, res, next) => {
    try{
      const id = req.body.id;
      const roleUpdated = await Role.findByIdAndUpdate(id, req.body, {new:true});
      res.send({...codes.SUCCESS[req.language], data:roleUpdated})
    }
    catch(err){
        console.log(err);
        res.status(400).send({...codes.SYSTEM_ERROR[req.language], error: err.message}) 
    }
}