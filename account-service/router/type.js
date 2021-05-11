const express = require('express');
const router = express.Router();
const typeController = require('../controller/typeController');
const Permission = require('../../common/permission/permission');
const Transfer = require('../../common/transfer-data/AbstractTransfer');

const pReadType = new Permission('type', 'read');
const tReadType = new Transfer({isPaging:true});

router.post('/create',typeController.create);
router.get('',pReadType.handle(), tReadType.handleValidation(), tReadType.handleTransferData(), typeController.read);

module.exports = router;