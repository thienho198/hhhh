const Joi = require('joi');
const {PHONE_REGEX} = require('../enum/regex')

module.exports.registerValidator = (data) =>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    });
    return schema.validate(data, {stripUnknown: true});
}

module.exports.cRole = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        resources: Joi.array().items(Joi.object(
            {
                name:Joi.string().required(),
                create: Joi.boolean(),
                read: Joi.boolean(),
                update: Joi.boolean(),
                delete: Joi.boolean()
            }
            ))
       
    })
    return schema.validate(data, {stripUnknown: true});
}