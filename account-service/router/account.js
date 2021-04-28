const Router = require('express').Router();
const accountController = require('../controller/accountController');
const validator = require('../../common/util/validator');
const Permission = require('../../common/permission/permission');
const AccountTransfer = require('../../common/transfer-data/AccountTransfer');

const pReadList = new Permission('account','read');
const tReadList = new AccountTransfer({isPaging:true});

Router.post('/create', accountController.create);

Router.get('/', pReadList.handle(), tReadList.handleValidation(), tReadList.handleTransferData(), accountController.getList);

Router.get('/get-info', accountController.getAccount);

module.exports = Router;