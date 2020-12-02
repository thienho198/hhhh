const validators = require('../../common/util/validator');
const codes = require('../../common/enum/codes');
const utils = require('../../common/util');
const Client = require('../model/client');

module.exports.createClient = async (req, res, next) => {
    if(body = utils.checkValidBody(req, res, validators.cClient)){
        try{
            if (body.client_secret){
                const client_secret = await utils.generateHashPwd(body.client_secret);
                body.client_secret = client_secret;
            }
            if(body.grants.indexOf('authorization_code')>=0 && !body.redirect_uris)
                return res.send({...codes.BAD_REQUEST[req.language], message:'Missing redirect_uris for authorization_code grant type.'});
            const client = await Client.create(body);
            res.send({...codes.SUCCESS[req.language], data: client});
        }   
        catch(err) {
            console.log(err);
            res.send({...codes.SYSTEM_ERROR[req.language], message: err.message})
        }
    }
}

