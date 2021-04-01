const Router = require('express').Router();
const clientController = require('../controller/clientController');

Router.post('/create',clientController.create);

module.exports = Router;