const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const clientController = require('../controller/clientController');

router.post('/role/create', roleController.createRole);

router.post('/client/create', clientController.createClient);


module.exports = router;