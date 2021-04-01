var util = require('util');
const AbstractTransfer = require('./AbstractTransfer');

function BookTranfer(options){
    AbstractTransfer.call(this, options)
}

BookTranfer.prototype.customHandleTransferData = function(req, res){
    const method = req.method;
    if(method == 'GET' || method == 'DELETE'){
        if(!req.query.sort){
            req.query.sort = {createdAt:-1}
        }
    }
}

util.inherits(BookTranfer, AbstractTransfer);

module.exports = BookTranfer;