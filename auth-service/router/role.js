const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');

router.post('/create', roleController.create);
router.get('', roleController.read)


module.exports = router;