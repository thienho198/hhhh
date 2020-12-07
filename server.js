require('./common/database/mongo')();
require('./common/database/redis').getInstance();
const {LANGUAGE_REGEX} = require('./common/enum/regex');
const {VI} = require('./common/enum/constants')
const util = require('./common/util');
const express = require('express');
const app = express();
const accountRoute = require('./account-service/router');
const originRoute = require('./auth-service/router/other');
const requestGrantRoute = require('./auth-service/router/request-grant');
const authorizeRoute = require('./auth-service/router/authorize');
const oAuth2Service = require('./common/oauth2').getInstance();
const middlewares = require('./common/middleware');

app.use(middlewares.corsMiddleware);
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

app.use('/auth', authorizeRoute);
app.use(oAuth2Service.authenticateRequest);
app.use('/account',accountRoute);
app.use('/auth', requestGrantRoute);
app.use('/auth', originRoute);

app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))