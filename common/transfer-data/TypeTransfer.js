var util = require('util');
const AbstractTransfer = require('./AbstractTransfer');

function TypeTranfer(options){
    AbstractTransfer.call(this, options)
}

TypeTranfer.prototype.customHandleTransferData = function(req, res){
    const method = req.method;
    if(method == 'GET' || method == 'DELETE'){
        if(!req.query.sort){
            req.query.sort = {createdAt:-1}
        }
        const keys = Object.keys(req.query);
        keys.forEach(key =>{
                    if(/^filter_array_regex/.test(key)){
                        req.query.filter[key.replace('filter_array_regex_','')] = {$elemMatch: {$regex:new RegExp(req.query[key],'i')} }
                    }
        })
    }
}

util.inherits(TypeTranfer, AbstractTransfer);

module.exports = TypeTranfer;