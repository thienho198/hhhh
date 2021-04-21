
const express = require('express');
const router = express.Router();
const typeRouter = require('./type');
const menuRouter = require('./menu');
const accoutRouter = require('./account');

router.use('/type', typeRouter);

router.use('/menu', menuRouter);

router.use('/account', accoutRouter);

module.exports = router;