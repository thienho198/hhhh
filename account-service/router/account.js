const Router = require('express').Router();
const accountController = require('../controller/accountController');
const validator = require('../../common/util/validator');
const Permission = require('../../common/permission/permission');
const AccountTransfer = require('../../common/transfer-data/AccountTransfer');

const pReadList = new Permission('account','read');
const pUpdateAccount = new Permission('account','update');
const pCreateAccount = new Permission('account','create');
const pDeleteAccount = new Permission('account','delete');
const tReadList = new AccountTransfer({isPaging:true, isSearching:true, validator:validator.rAccount});
const tCreateAccount = new AccountTransfer({validator:validator.cAccount})
const tUpdateAccount = new AccountTransfer({validator:validator.uAccount})
const tDeleteAccount = new AccountTransfer({validator:validator.dAccount})
Router.post('/create', pCreateAccount.handle(),tCreateAccount.handleValidation(),accountController.create);

Router.get('/', pReadList.handle(), tReadList.handleValidation(), tReadList.handleTransferData(), accountController.getList);

Router.put('/update',pUpdateAccount.handle(), tUpdateAccount.handleValidation(), accountController.update)

Router.delete('/delete', pDeleteAccount.handle(), tDeleteAccount.handleValidation(), accountController.delete)

Router.get('/get-info', accountController.getAccount);

module.exports = Router;