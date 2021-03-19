const express = require('express');
const router = express.Router();
const {signUpNormalAccount} = require('../controller/accountController');

router.post('/signup',signUpNormalAccount);

module.exports = router;