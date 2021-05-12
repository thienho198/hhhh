const express = require('express');
const router = express.Router();
const typeController = require('../controller/typeController');
const Permission = require('../../common/permission/permission');
const Transfer = require('../../common/transfer-data/TypeTransfer');
const validators = require('../../common/util/validator');
const pReadType = new Permission('type', 'read');
const pUpdateType = new Permission('type', 'update');
const pCreateType = new Permission('type', 'create');
const tCreateType = new Transfer({validator:validators.cType})
const tUpdateType = new Transfer({validator:validators.uType})
const tReadType = new Transfer({isPaging:true, validator:validators.rType});

router.post('/create',pCreateType.handle(),tCreateType.handleValidation(),typeController.create);
router.get('',pReadType.handle(), tReadType.handleValidation(), tReadType.handleTransferData(), typeController.read);
router.put('/update', pUpdateType.handle(), tUpdateType.handleValidation(), typeController.update);

module.exports = router;