var util = require('util');
const AbstractTransfer = require('./AbstractTransfer');

function AccountTransfer(options){
    AbstractTransfer.call(this, options)
}

AccountTransfer.prototype.customHandleTransferData = function(req, res){
    const method = req.method;
    if(method == 'GET'){
        if(!req.query.sortBy && !req.query.orderBy){
            req.query.sort = {createdAt:-1}
        }
    }
}

util.inherits(AccountTransfer, AbstractTransfer);

module.exports = AccountTransfer;