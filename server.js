require('./common/database/mongo')();
const {LANGUAGE_REGEX} = require('./common/enum/regex');
const {VI} = require('./common/enum/constants')
const util = require('./common/util');
const express = require('express');
const app = express();
const accountRoute = require('./account-service/router');
const authRoute = require('./auth-service/router');
const oAuth2Service = require('./common/oauth2').getInstance();
const codes = require('./common/enum/codes');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((req,res,next)=>{
    const language = req.headers['accept-language'];
    req.language = LANGUAGE_REGEX.test(language) ? language.toString().toUpperCase() : VI;
    if(error = util.checkSystemError(req.language)){
        res.send(error);
    }
    next();
})
app.all('/oauth/token', oAuth2Service.obtainToken);
app.all('/oauth/create-authorization-code', oAuth2Service.createAuthorizationCode)
app.use(oAuth2Service.authenticateRequest);
app.use('/',(req, res, next)=>{
    res.send({...codes.SUCCESS[req.language]})
})
app.use('/account',accountRoute);
app.use('/auth', authRoute);

app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))