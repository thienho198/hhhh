const codes = require('../enum/codes');
const OAuth2Server = require('oauth2-server'), Request = OAuth2Server.Request, Response = OAuth2Server.Response;
const OAuth2Model = require('./model/oauth2Model').getInstance();
const userController = require('../../account-service/controller/accountController');

var instance;

/**
 * Instantiates OAuth2Server using the supplied model.
 */

var oAuth2 = new OAuth2Server({
                                model:OAuth2Model,
                                accessTokenLifetime: 86500,
                                allowBearerTokensInQueryString: true
                            });

/**
 * Creating constructor
 */

function OAuth2Service(){
}

/**
 * Define the shared properties and methods using the prototype
 */

 /**
 * Obtaine OAuth token with Basic Authentication
 */
OAuth2Service.prototype.obtainToken = function(req,res){
    
    let request = new Request(req);
    let response = new Response(res);
    return oAuth2.token(request,response)
            .then(token =>{
                res.send({...codes.SUCCESS[req.language], data: token});
            })
            .catch(err=>{
                console.log(err);
                res.status(401).send({...codes.SYSTEM_ERROR[req.language], message: err.message});
            })
}

 /**
 * Create Athorization Code
 */
OAuth2Service.prototype.createAuthorizationCode = async function(req, res){
    try {
        let request = new Request(req);
        let response = new Response(res);
    
        const {authenticate, user} = await userController.authenticateUser(req.body.username, req.body.password);
        let authenticateHandler = {
            handle:  function(request, response) {
              request.query.allowed = authenticate.toString();
              return user;
            }
          };
        
        oAuth2.authorize(request, response,  {authenticateHandler: authenticateHandler})
        .then(code=>{
            console.log(code);
            // res.locals.oauth = {code: code};
            res.send({...codes.SUCCESS[req.language], data: code});
        })
        
        
    }
   catch(err) {
       console.log(err);
       res.send({...codes.SYSTEM_ERROR[req.language], message: err.message});
   }

}

/**
 * Authenticates a request.
 */
OAuth2Service.prototype.authenticateRequest = function(req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    oAuth2.authenticate(request, response)
        .then(token =>{
            req.token = token;
            next();
        })
        .catch(err =>{
            console.log(err);
            res.status(401).send({message: err.message});
        })
}

/**
 * Export an Instance
 */
module.exports = {
    getInstance: function (namespace, opts, backupService) {
        if (!instance) {
            instance = new OAuth2Service(namespace, opts, backupService);
        }

        return instance;
    }
};