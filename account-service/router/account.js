const Router = require('express').Router();
const accountController = require('../controller/accountController');

Router.post('/create', accountController.create);

Router.get('/get-info', accountController.getAccount);

module.exports = Router;