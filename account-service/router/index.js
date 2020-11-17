
const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

router.post('/create',accountController.createAccount)

module.exports = router;