const Router = require('express').Router();
const roleRouter = require('./role');
const clientRouter = require('./client');
const originRouter = require('./origin');

Router.use('/role',roleRouter);
Router.use('/client',clientRouter);
Router.use('/origin',originRouter);

module.exports = Router;