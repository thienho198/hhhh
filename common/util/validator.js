const Joi = require('joi');
const {PHONE_REGEX} = require('../enum/regex')

module.exports.registerValidator = (data) =>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthday: Joi.string().required(),
        phone: Joi.string().regex(PHONE_REGEX),
    });
    return schema.validate(data, {stripUnknown: false});
}


module.exports.cRole = (data)=>{
    const schema = Joi.object({
                    role:Joi.string().required(),
                    resource: Joi.string().required(),
                    action: Joi.string().required(),
                    attributes: Joi.string().required(),
                }
            )
            
    return schema.validate(data, {stripUnknown: true});
}

module.exports.cClient = (data)=>{
    const schema = Joi.object({
        grants: Joi.array().items(Joi.string()).required(),
        client_secret: Joi.string(),
        redirect_uris:Joi.array().items(Joi.string()),
        name: Joi.string().required()
    })
    return schema.validate(data, {stripUnknown: true});
}

module.exports.cAuthorizationCode = (data) => {
    const schema = Joi.object({
        authorization_code: Joi.string().required(),
        expires_at: Joi.date().required(),
        scope: Joi.string(),
        client_id: Joi.string().required(),
        user_id: Joi.string().required(),
        redirect_uris: Joi.string().required()
    })
    return schema.validate(data, {stripUnknown: true});
}

module.exports.cOrigin = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        origin_url: Joi.string().required()
    });
    return schema.validate(data, {stripUnknown: true});
}