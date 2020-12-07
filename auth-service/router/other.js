const router = require('express').Router();
const originController = require('../controller/originController');
const middleware = require('../../common/middleware');

router.get('/origin/get', originController.getOrigin);
router.post('/origin/create', originController.createOrigin);

module.exports = router;