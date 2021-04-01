const Type = require('../model/type');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const util = require('../../common/util');

module.exports.create = async(req, res)=>{
    const {error, value} = validators.cType(req.body);
    if(error){
        res.status(400).send({message:error.message})
    }
    else{
        try{
          await util.checkPermission(req,'type','create');  
          const result = await Type.create(value);
          res.send({...codes.SUCCESS[req.language], data:result})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }
}

module.exports.read = async(req, res)=>{
    try{
        await util.checkPermission(req,'type','read');
        const result = await Type.find();
        res.send({...codes.SUCCESS[req.language], data:result});
    }
    catch(err) {
        res.status(500).send({message:err.message})
    }
}