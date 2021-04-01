const Origin = require('../model/origin');
const codes = require('../../common/enum/codes');
const constants = require('../../common/enum/constants');
const validators = require('../../common/util/validator');
const utils = require('../../common/util');
const redisClient = require('../../common/database/redis').getInstance().client;

module.exports.read = async(req, res, next) => {
    try{
        const origins = await Origin.find({});
        res.send({...codes.SUCCESS[req.language], data: origins})
    }
    catch(err) {
        console.log(err);
        res.send({...codes.SYSTEM_ERROR[req.language], message: err.message});
    }

}

module.exports.create = async (req, res, next)=>{
    if(utils.checkValidBody(req, res, validators.cOrigin)){
        try {
            const origin = await Origin.create(req.body);
            redisClient.del(constants.CACHE_ORIGIN_KEY);
            res.send({...codes.SUCCESS[req.language], data: origin})
        }
        catch(err) {
            console.log(err);
            res.send({...codes.SYSTEM_ERROR[req.language], message: err.message});
        }
    }
}

module.exports.getListOriginUrls = async()=>{
    try{
        const origins = await Origin.find({});
        const origin_urls = origins.map(item=>item.origin_url);
        return origin_urls;
    }
    catch(err) {
        throw(err);
    }
}

