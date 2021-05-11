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
        const {filter,sort,limit,skip,projection} = req.query; 
        let [result,count] = await Promise.all([
            Type.find(filter,projection,{skip:skip,limit:limit,sort:sort}).populate('type').lean(),
            Type.countDocuments(filter)
        ])
        res.send({...codes.SUCCESS[req.language],data:result, count:count})
    }
    catch(err) {
        res.status(500).send({message:err.message})
    }
}