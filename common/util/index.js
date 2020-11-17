const constants = require('../enum/constants');
const codes = require('../enum/codes');
const bcrypt = require('bcrypt');

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
        res.send(codes.BAD_REQUEST[req.language]);
        return false;
    }
    return value;
}

module.exports = {
    checkSystemError: checkSystemError,
    generateHashPwd: generateHashPwd,
    checkHashPwd: checkHashPwd,
    checkValidBody: checkValidBody
}