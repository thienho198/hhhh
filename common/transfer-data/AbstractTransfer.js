const Joi = require('joi');

const METHODS = {
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    DELETE:'DELETE'
}

function AbstractTransfer(options){
    options = options || {};
    this.isPaging = options.isPaging || false;
    this.isSorting = options.isSorting || false;
    this.validator = options.validator || {};
}

AbstractTransfer.prototype.handleTransferData = function(){
    return async(req, res, next)=>{
        try{
            const method =  req.method;
            const isUseQuery =  (method === METHODS.GET || method === METHODS.DELETE)
            const data = isUseQuery ? req.query : req.body; 
            if(this.isPaging){ 
                if(method == METHODS.GET || method == METHODS.DELETE){
                    const skip = (data.page * data.page_size) - data.page_size ;
                    const limit = data.page_size;
                    delete req.query.page;
                    delete req.query.page_size;
                    req.query.skip = skip;
                    req.query.limit = limit;
                }
                else{
                    const skip = (data.page * data.page_size) - data.page_size ;
                    const limit = data.page_size;
                    delete req.body.page;
                    delete req.body.page_size;
                    req.body.skip = skip;
                    req.body.limit = limit;
                }
    
            }
            
            await this.customHandleTransferData(req, res);
            next();
        }
        catch(err){
            console.error(err);
            res.status(500).send({message:err.message})
        }
    }
}

AbstractTransfer.prototype.customHandleTransferData = async function(req, res){
    return Promise.resolve()
}

AbstractTransfer.prototype.handleValidation = function(){
    return async (req, res, next)=>{
        try{
            const method =  req.method;
            const isUseQuery =  (method === METHODS.GET || method === METHODS.DELETE)
            const data = isUseQuery ? req.query : req.body; 
            let pagingValidaOj = {};
            let projectionValidaOj = {};
            let sortValidaOj = {};
    
            if(this.isPaging){
                pagingValidaOj = {
                    page: Joi.number().required(),
                    page_size: Joi.number().required()
                };
            }
            if(this.isSorting){
                 sortValidaOj ={
                    sortBy: Joi.string().required(),
                    orderBy: Joi.string().required(),
                }
            }
            if(data.projection){
                 projectionValidaOj ={
                    projection: [Joi.string(),Joi.array().items(Joi.string()),Joi.object()]
                }
            }

            const schema = Joi.object({...pagingValidaOj, ...projectionValidaOj,...sortValidaOj, ...this.validator})
            const value = await schema.validateAsync(data);
            if(isUseQuery){
                req.query = value;
            }
            else{
                req.body = value;
            }
            next();
        }
        catch(err) {
            console.error(err);
            res.status(500).send({message:err.message});
        }
     
    }
} 


module.exports = AbstractTransfer;