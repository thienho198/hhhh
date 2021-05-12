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


module.exports.cAccount = {
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthday: Joi.string().required(),
        phone: Joi.string().regex(PHONE_REGEX),
        type: Joi.string().required(),
}

module.exports.dAccount = {
    id: Joi.string().required()
}


module.exports.cRole = (data)=>{
    const schema = Joi.object({
                    role:Joi.string().required(),
                    resource: Joi.string().required(),
                    action: Joi.string().required(),
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

module.exports.cType = (data) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        roles: Joi.array().items(Joi.string())
    })
    return schema.validate(data);
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

module.exports.cBook = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        subject: Joi.string().required(),
        overview: Joi.string(),
        publisher: Joi.string().required(),
        author: Joi.string().required(),
        language: Joi.string()
    })
    return schema.validate(data)
}

module.exports.uBook = (data) =>{
    const schema = Joi.object({
        id: Joi.string().required(),
        title: Joi.string(),
        subject: Joi.string(),
        overview: Joi.string(),
        publisher: Joi.string(),
        author: Joi.string(),
        language: Joi.string()
    })
    return schema.validate(data)
}

module.exports.dBook = (data) =>{
    const schema = Joi.object({
        id: Joi.string().required()
    });
    
    return schema.validate(data);
}

module.exports.paging = (data) =>{
    const schema = Joi.object({
        page: Joi.number().required(),
        page_size: Joi.number().required()
    })
    const {error, value} = schema.validate(data,{allowUnknown:true});
    if(error) throw Error(error);
    return value;
}

module.exports.cMenu = {
    name:Joi.string().required(),
    parentId:Joi.string(),
    isActive: Joi.boolean(),
    parentPosition:Joi.string(),
    requiredTypes: Joi.array().items(Joi.string()),
}

module.exports.dRole = {
    id:Joi.string().required()
}
module.exports.uRole = {
    id:Joi.string().required(),
    role:Joi.string(),
    resource: Joi.string(),
    action: Joi.string(),
    attributes: Joi.string(),
}
module.exports.uMenu = {
    name:Joi.string(),
    requiredTypes: Joi.array().items(Joi.string()),
    id: Joi.string().required(),
}

module.exports.rRole = {
    filter_regex_action: Joi.string(),
    filter_regex_attributes: Joi.string(),
    filter_date_range_from_createdAt: Joi.string(),
    filter_date_range_to_createdAt: Joi.string(),
    filter_date_range_from_updatedAt: Joi.string(),
    filter_date_range_to_updatedAt: Joi.string()
}

module.exports.rAccount = {
    filter_regex_email: Joi.string(),
    filter_regex_birthday: Joi.string(),
    filter_regex_phone: Joi.string(),
    filter_regex_type: Joi.string(),
    filter_date_range_from_createdAt: Joi.string(),
    filter_date_range_to_createdAt: Joi.string(),
    filter_date_range_from_updatedAt: Joi.string(),
    filter_date_range_to_updatedAt: Joi.string()
}

module.exports.uAccount = {
    email: Joi.string().email(),
    password: Joi.string().min(6),
    firstName: Joi.string(),
    lastName: Joi.string(),
    birthday: Joi.string(),
    phone: Joi.string().regex(PHONE_REGEX),
    type: Joi.string(),
    id: Joi.string().required()
}

module.exports.rMenu = {
    filter_date_range_from_createdAt: Joi.string(),
    filter_date_range_to_createdAt: Joi.string(),
    filter_date_range_from_updatedAt: Joi.string(),
    filter_date_range_to_updatedAt: Joi.string(),
    filter_regex_name: Joi.string(),
    filter_regex_requiredTypes: Joi.string(),
    filter_regex_isActive: Joi.string(),
    filter_boolean_isActive: Joi.boolean(),
    filter_array_regex_requiredTypes: Joi.string(),
}

module.exports.dMenu = {
    position: Joi.string().required()
}

module.exports.rType = {
    filter_regex_name: Joi.string(),
    filter_array_regex_roles: Joi.string(),
    filter_date_range_from_createdAt: Joi.string(),
    filter_date_range_to_createdAt: Joi.string(),
    filter_date_range_from_updatedAt: Joi.string(),
    filter_date_range_to_updatedAt: Joi.string()
}

module.exports.cType = {
    name: Joi.string().required(),
    role:Joi.array().items(Joi.string())
}

module.exports.uType = {
    name: Joi.string().required(),
    roles:Joi.array().items(Joi.string()),
    id: Joi.string().required()
}