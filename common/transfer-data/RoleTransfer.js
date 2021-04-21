var util = require('util');
const AbstractTransfer = require('./AbstractTransfer');

function RoleTransfer(options){
    AbstractTransfer.call(this, options)
}

RoleTransfer.prototype.customHandleTransferData = function(req, res){
    const method = req.method;
    if(method == 'GET'){
        if(!req.query.sortBy && !req.query.orderBy){
            req.query.sort = {createdAt:-1}
        }
    }
}

util.inherits(RoleTransfer, AbstractTransfer);

module.exports = RoleTransfer;