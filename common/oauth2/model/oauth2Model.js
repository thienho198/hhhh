
const AccessToken = require('../../../auth-service/model/accessToken');
const User = require('../../../account-service/model/account');
const Client = require('../../../auth-service/model/client');
const RefreshToken = require('../../../auth-service/model/refreshToken');
const AuthorizationCode = require('../../../auth-service/model/authorizationCode');
const Promise = require('bluebird');
const authorizationCodeController = require('../../../auth-service/controller/authorizationCodeController');
const utils = require('../../util');
const { use } = require('../../../auth-service/router/request-grant');

var instance;

/**
 * Constructor 
 */ 

function OAuth2Model() {
  
}

OAuth2Model.prototype.getAccessToken = function(accessToken){
   return AccessToken.findOne({access_token: accessToken}).exec()
     .then(token=>{
         return Promise.all([token,User.findById(token.user_id), Client.findById(token.client_id)])
         .spread((token, user, client)=>{
            return {
               accessToken: token.access_token,
               accessTokenExpiresAt: token.expires_at,
               scope: token.scope,
               client: client, // with 'id' property
               user: user
            }
        })
     })
     
}

OAuth2Model.prototype.getRefreshToken = function(refreshToken){
  return RefreshToken.findOne({refresh_token: refreshToken})
    .then(token=>{
        return Promise.all([token,User.findById(token.user_id), Client.findById(token.client_id)])
        .spread((token, user, client)=>{
            return {
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.expires_at,
                scope: token.scope,
                client: client, // with 'id' property
                user: user
            }
        })
    })
    
}

OAuth2Model.prototype.revokeAuthorizationCode = async function(code){
    try{
       await AuthorizationCode.deleteOne({authorization_code: code.code});
       return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
    

}

OAuth2Model.prototype.getClient = function (clientId, clientSecret){
    if(!clientSecret){
        return Client.findById(clientId).exec()
        .then(client=>{
            return {
                id: client.id,
                grants: client.grants,
                redirectUris: client.redirect_uris
              };
        })
        .catch(err=>{
            console.log(err)
        })
    }
    else{
        return Client.findById(clientId).exec()
        .then(client=>{
           return utils.checkHashPwd(clientSecret, client.client_secret).then(result=>{
               if(result){
                return {
                    id: client.id,
                    grants: client.grants,
                    redirectUris: client.redirect_uris
                  };
               }
            })
            .catch(err =>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }
  
}

OAuth2Model.prototype.getUser = async function(username, password){
    try {
      const user = await User.findOne({email:username});
      await utils.checkHashPwd(password, user.password);
      return user;
    }
    catch(err) {
        console.log(err);
    }
}

OAuth2Model.prototype.saveAuthorizationCode = async function(code, client, user){
    
        let authCode = {
            authorization_code: code.authorizationCode,
            expires_at: code.expiresAt,
            redirect_uris: code.redirectUri,
            scope: code.scope,
            client_id: client.id,
            user_id: user.id
          };
        return AuthorizationCode.create(authCode)
                .then(code=>{
                    console.log(code);
                    return {
                        authorization_code: code.authorization_code,
                        expires_at: code.expires_at,
                        redirect_uri: code.redirect_uris,
                        scope: code.scope,
                        client_id: code.client_id,
                        user_id: code.user_id,
                        authorizationCode: code.authorization_code,
                    }
                })
                .catch(err =>console.log(err))
}
OAuth2Model.prototype.getAuthorizationCode = async function (getAuthorizationCode){
    try {
        const authorizationCode = await authorizationCodeController.get(getAuthorizationCode);
        const client = await Client.findById( authorizationCode.client_id).exec();
        const user = await User.findById(authorizationCode.user_id);

        return {
            expiresAt: authorizationCode.expires_at,
            redirectUri: authorizationCode.redirect_uris,
            scope: authorizationCode.scope,
            client: client, // with 'id' property
            user: user,
            code: authorizationCode.authorization_code
          };
    }   
    catch(err) {
        console.log(err);
    }

}

OAuth2Model.prototype.saveToken = function(token, client, user){
    let fns = [AccessToken.create(
        {
            access_token: token.accessToken,
            expires_at: token.accessTokenExpiresAt,
            scope: token.scope,
            client_id: client.id,
            user_id: user.id
        }),
        RefreshToken.create({
            refresh_token: token.refreshToken,
            expires_at: token.refreshTokenExpiresAt,
            scope: token.scope,
            client_id: client.id,
            user_id: user.id
        })
        ];
    return Promise.all(fns)
            .spread((accessToken, refreshToken)=>{
                return {
                    accessToken: accessToken.access_token,
                    accessTokenExpiresAt: accessToken.expires_at,
                    refreshToken: refreshToken.refresh_token,
                    refreshTokenExpiresAt: refreshToken.expires_at,
                    scope: accessToken.scope,
                    client: {id: accessToken.client_id},
                    user: {id: accessToken.user_id}
                  };
            })
}

module.exports = {
    getInstance: function () {
        if (!instance) {
            instance = new OAuth2Model();
        }

        return instance;
    }
};