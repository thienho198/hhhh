const constants = require('../enum/constants');
const codes = require('../enum/codes');
const bcrypt = require('bcrypt');
const Role = require('../../auth-service/model/role');
const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const saltRounds = 11;

const checkSystemError = (language)=> {
    const message = []
    if (Number(process.env[constants.REDIS_CONNECT_ERROR])) message.push('Redis')
    if (Number(process.env[constants.MONGO_CONNECT_ERROR])) message.push('Mongo')
    if (message.length) return { code: codes.DATABASE_CONNECT_ERROR[language].code, message: `${message} Disconnected` }
    return false
}

const generateHashPwd = (plainTextPassword)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(plainTextPassword, saltRounds, (err, hash)=>{
            err ? reject(err) : resolve(hash);
        })
    })
}

const checkHashPwd = (plainTextPassword, hashPwd)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(plainTextPassword, hashPwd, (err,result)=>{
            err ? reject(err) : resolve(result);
        })
    })
}

const checkValidBody = (req, res, validator)=>{
    const {error, value} = validator(req.body);
    if(error) {
        res.send({...codes.BAD_REQUEST[req.language], error: error});
        return false;
    }
    return value;
}

const checkValidBodyNotRes = (body, validator) => {
    const {error, value} = validator(body);
    if(error) {
        throw error
    }
    return value;
}

const checkPermission = async (req,resource,action,isOwn) => {
    const permissionByAction = (ac,role,resource,action)=>{
        switch(action){
            case 'create': 
                if(isOwn){
                    return ac.can(role).createOwn(resource).granted ? ac.can(role).createOwn(resource) : ac.can(role).createAny(resource);
                }
                return ac.can(role).createAny(resource);
            case 'read':
                if(isOwn){
                    return ac.can(role).readOwn(resource).granted ? ac.can(role).readOwn(resource) : ac.can(role).readAny(resource);
                }
                return ac.can(role).readAny(resource);
            default:
                throw new Error(`Invalid action ${action}`)
        }
    }

    try{
        const user = req.token.user;
        if(user.type.roles.indexOf('super admin')>=0){
            return Promise.resolve({granted:true, attributes:'*'});
        }
        const roles = await Role.find().lean();
        ac.setGrants(roles);
        for(let i = 0; i < user.type.roles.length; i++){
            const permission = permissionByAction(ac,user.type.roles[i],resource,action);
            if(permission.granted){
                return Promise.resolve({granted:true, attributes: permission.attributes})
            }
        }
        return Promise.reject({message:codes.ACCESS_DENIED[req.language].message})
    }
    catch(err){
        console.log(err);
        return Promise.reject({...err, message:codes.ACCESS_DENIED[req.language].message})
    }
}

module.exports = {
    checkSystemError: checkSystemError,
    generateHashPwd: generateHashPwd,
    checkHashPwd: checkHashPwd,
    checkValidBody: checkValidBody,
    checkValidBodyNotRes: checkValidBodyNotRes,
    checkPermission: checkPermission
}