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
    this.isSearching = options.isSearching || false;
    this.validator = options.validator || {};
}

AbstractTransfer.prototype.handleTransferData = function(){
    return async(req, res, next)=>{
        try{
            const method =  req.method;
            const isUseQuery =  (method === METHODS.GET || method === METHODS.DELETE)
            const data = isUseQuery ? req.query : req.body; 
            data.filter = {}
            //paging 
            if(this.isPaging){ 
                if(method == METHODS.GET){
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
            // searching
            if(this.isSearching){
                if(method == METHODS.GET && data.search_value){
                    req.query.filter['$text'] = {'$search': data.search_value};
                }
            }
            // sorting
            if(this.isSorting){
                if(method == METHODS.GET){
                    req.query.sort = {[req.query.sortBy]:req.query.orderBy}
                }
            }
            // filtering
            if(method == METHODS.GET){
                const keys = Object.keys(req.query);
                keys.forEach(key =>{
                    if(/^filter_regex/.test(key)){
                        req.query.filter[key.replace('filter_regex_', '')] = new RegExp(req.query[key],'i');
                    }
                    else if(/^filter_date_range_from/.test(key)){
                        let filterDateRange = req.query.filter[key.replace('filter_date_range_from_', '')];
                        if(!filterDateRange){
                            req.query.filter[key.replace('filter_date_range_from_', '')] = {};
                            filterDateRange = req.query.filter[key.replace('filter_date_range_from_', '')]
                        }
                        filterDateRange['$gte'] = new Date(req.query[key]);
                    }
                    else if(/^filter_date_range_to/.test(key)){
                        let filterDateRange=req.query.filter[key.replace('filter_date_range_to_', '')];
                        if(!filterDateRange){
                            req.query.filter[key.replace('filter_date_range_to_', '')] = {};
                            filterDateRange = req.query.filter[key.replace('filter_date_range_to_', '')]
                        }
                        filterDateRange['$lte'] = new Date(req.query[key]);
                      }
                    else if(/^filter_boolean/.test(key)){
                        req.query.filter[key.replace('filter_boolean_', '')] = req.query[key];
                    }
                    // else if(/^filter_array_regex/.test(key)){
                    //     req.query.filter[key.replace('filter_array_regex_','')] = {$elemMatch: {$regex:new RegExp(req.query[key],'i')} }
                    // }
            
                })
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
            let searchValidaOj = {};
    
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
            if(this.isSearching){
                searchValidaOj = {
                    search_value: Joi.string()
                }
            }
            if(data.projection){
                 projectionValidaOj ={
                    projection: [Joi.string(),Joi.array().items(Joi.string()),Joi.object()]
                }
            }

            const schema = Joi.object({...pagingValidaOj, ...projectionValidaOj,...sortValidaOj,...searchValidaOj, ...this.validator})
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