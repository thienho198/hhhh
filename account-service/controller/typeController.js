const Type = require('../model/type');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const util = require('../../common/util');

module.exports.create = async(req, res)=>{
        try{
          const result = await Type.create(value);
          res.send({...codes.SUCCESS[req.language], data:result})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
}

module.exports.read = async(req, res)=>{
    try{
        const {filter,sort,limit,skip,projection} = req.query; 
        let [result,count] = await Promise.all([
            Type.find(filter,projection,{skip:skip,limit:limit,sort:sort}).lean(),
            Type.countDocuments(filter)
        ])
        res.send({...codes.SUCCESS[req.language],data:result, count:count})
    }
    catch(err) {
        console.log(err);
        res.status(500).send({message:err.message})
    }
}

module.exports.update = async(req, res)=>{
    try{
        const id = req.body.id;
        const updatedItem = await Type.findByIdAndUpdate(id, req.body, {new:true});
        res.send({...codes.SUCCESS[req.language],data:updatedItem})
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:err.message})
    }
}