
const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');
const typeRouter = require('./type');

router.post('/create',accountController.createAccount)

router.get('/get-info', accountController.getAccount);

router.use('/type', typeRouter);

module.exports = router;