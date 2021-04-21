const express = require('express');
const Router = express.Router();
const bookController = require('../controller/bookController');
const {transformDataPaging,cacheMiddleware} = require('../../common/middleware');
const Permission = require('../../common/permission/permission');
const permissionCreateBook = new Permission('book','create');
const permissionReadBook = new Permission('book','read');
const BookTranfer = require('../../common/transfer-data/BookTranfer');
const bookTranferGet = new BookTranfer({isPaging:true});

Router.post('/create',permissionCreateBook.handle(),bookController.create);
Router.get(
'',
permissionReadBook.handle(),
bookTranferGet.handleValidation(),
bookTranferGet.handleTransferData(),
bookController.read)

module.exports = Router;