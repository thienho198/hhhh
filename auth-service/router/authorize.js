const router = require('express').Router();
const oAuth2Service = require('../../common/oauth2').getInstance();

router.post('/token', oAuth2Service.obtainToken);

router.post('/create-authorization-code', oAuth2Service.createAuthorizationCode);

module.exports = router;