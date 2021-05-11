const Router = require('express').Router();
const menuController = require('../controller/menuController');
const Permission = require('../../common/permission/permission');
const pCreateMenu = new Permission('menu','create');
const pReadMenu = new Permission('menu','read');
const pUpdateMenu = new Permission('menu','update');
const pDeleteMenu = new Permission('menu','delete');

const MenuTransfer = require('../../common/transfer-data/MenuTransfer');
const validors = require('../../common/util/validator');
const tCreateMenu = new MenuTransfer({validator:validors.cMenu});
const tUpdateMenu = new MenuTransfer({validator:validors.uMenu});
const tReadMenu = new MenuTransfer({isPaging:true, isSearching:true, validator: validors.rMenu});
const tDeleteMenu = new MenuTransfer({validator:validors.dMenu});

Router.post('/create',pCreateMenu.handle(),tCreateMenu.handleValidation(),menuController.create);
Router.put('/update',pUpdateMenu.handle(),tUpdateMenu.handleValidation(),menuController.update);
Router.get('',pReadMenu.handle(),tReadMenu.handleValidation(),tReadMenu.handleTransferData(),menuController.read);
Router.delete('/delete',pDeleteMenu.handle(), tDeleteMenu.handleValidation(), menuController.delete);
module.exports = Router;