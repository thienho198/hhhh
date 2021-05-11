const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const Permission = require('../../common/permission/permission');
const RoleTransfer = require('../../common/transfer-data/RoleTransfer');

const validators = require('../../common/util/validator');
const pDeleteRole = new Permission('role','delete');
const pReadRole = new Permission('role','read');
const pUpdateRole = new Permission('role','update');
const tReadLRole = new RoleTransfer({isPaging:true, isSearching: true, validator:validators.rRole});
const tDeleteRole = new RoleTransfer({validator:validators.dRole})
const tUpdateRole = new RoleTransfer({validator:validators.uRole})
router.post('/create', roleController.create);
router.delete('/delete',pDeleteRole.handle(),tDeleteRole.handleValidation(),roleController.delete);
router.put('/update', pUpdateRole.handle(),tUpdateRole.handleValidation(),roleController.update);
router.get('',pReadRole.handle(), tReadLRole.handleValidation(), tReadLRole.handleTransferData() ,roleController.read)


module.exports = router;