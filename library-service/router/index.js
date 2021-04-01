const express = require('express');
const router = express.Router();
const bookRouter = require('./book');

router.use('/book',bookRouter);

module.exports = router;