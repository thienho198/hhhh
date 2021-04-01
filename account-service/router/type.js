const express = require('express');
const router = express.Router();
const typeController = require('../controller/typeController');

router.post('/create',typeController.create);
router.get('/read',typeController.read);

module.exports = router;