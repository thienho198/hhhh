const Router = require('express').Router();
const originController = require('../controller/originController');

Router.post('/create',originController.create);
Router.get('', originController.read);

module.exports = Router;