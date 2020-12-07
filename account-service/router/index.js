
const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

router.post('/create',accountController.createAccount)

router.get('/get-info', accountController.getAccount);

module.exports = router;