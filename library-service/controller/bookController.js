const Book = require('../model/book');
const util = require('../../common/util');
const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');

module.exports.create = async(req,res) => {
    const {error, value} = validators.cBook(req.body);
    if(error){
        res.status(400).send({error})
    }
    else{
        try {
            await util.checkPermission(req,'book','create');
            const book = await Book.create(value);
            res.send({...codes.SUCCESS[req.language], data: book})
        }
        catch(err) {
            console.error(err);
            res.status(400).send(err);
        }
    }
}

module.exports.read = async(req, res)=>{
    try {
        const {skip, limit} = req.query;
        const [count,result] = await Promise.all(
            [
                Book.estimatedDocumentCount(),
                Book.find().skip(skip).limit(limit)
            ]
            )
        res.send({...codes.SUCCESS[req.language], data:result, count:count})
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:err.message})
    }
}

module.exports.update = async(req,res)=>{
    const {error, value} = validators.uBook(req.body);
    if(error){
        res.status(400).send({error})
    }
    else{
        try{
            await util.checkPermission(req,'book','update');
            const result = await Book.findByIdAndUpdate(value.id, value, {new:true, timestamps: true, runValidators:true});
            res.send({...codes.SUCCESS[req.language], data:result})
        }
        catch(err) {
            console.error(err);
            res.status(500).send({message:err.message})
        }
    
    }
}

module.exports.delete = async(req,res)=>{
    
}