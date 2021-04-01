const router = require('express').Router();
const oAuth2Service = require('../../common/oauth2').getInstance();

router.post('/token',(req, res, next)=>{
    if (req.is('json'))
      req.headers['content-type'] = 'application/x-www-form-urlencoded';
    next();
  },oAuth2Service.obtainToken);
router.post('/create-authorization-code', oAuth2Service.createAuthorizationCode);

module.exports = router;