var util = require('util');
const AbstractTransfer = require('./AbstractTransfer');

function MenuTransfer(options){
    AbstractTransfer.call(this, options)
}

MenuTransfer.prototype.customHandleTransferData = function(req, res){
    const method = req.method;
    if(method == 'GET' || method == 'DELETE'){
        if(!req.query.sortBy && !req.query.orderBy){
            req.query.sort = {createdAt:-1}
        }
    }
}

util.inherits(MenuTransfer, AbstractTransfer);

module.exports = MenuTransfer;