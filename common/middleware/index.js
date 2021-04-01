const client = require('../database/redis').getInstance().client;
const originController = require('../../auth-service/controller/originController');
const constants = require('../enum/constants');
const codes = require('../enum/codes');
const validators = require('../../common/util/validator');
const cors = require('cors');

module.exports.cacheMiddleware = (req, res, next) => {
    const {skip,limit} = req.body;
    let key = "__express__" + (req.originalUrl || req.url) + 's' + skip + 'l' + limit;
    client.get(key, function(err, reply){
      if(reply){
          res.send(JSON.parse(reply));
      }else{
          res.sendResponse = res.send;
          res.send = (body) => {
              client.set(key, JSON.stringify(body));
              res.sendResponse(body);
          }
          next();
      }
    });
};
module.exports.transformDataPaging = (req, res, next) => {
    try{
        const value = validators.paging(req.query);
        const skip = (value.page * value.page_size) - value.page_size ;
        const limit = value.page_size;
        delete req.query.page;
        delete req.query.page_size;
        req.query.skip = skip;
        req.query.limit = limit;
        next();
    }
    catch(err) {
        console.log(err);
        res.status(err.code || 400).send({message:err.message || 'System error'})
    }
}
const funcForCors = (origin, whitelist, callback)=>{
    if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
}
const corsOptions = {
    origin: async function (origin, callback) {
        try{
            client.get(constants.CACHE_ORIGIN_KEY, async function(err, reply){
                if(reply){
                    funcForCors(origin,JSON.parse(reply), callback);
                }
                else{
                    const origin_urls = await originController.getListOriginUrls();
                    client.set(constants.CACHE_ORIGIN_KEY, JSON.stringify(origin_urls));
                    funcForCors(origin,origin_urls, callback);  
                }
            })
        }
        catch(err) {
            console.log(err);
            callback(new Error(err.message));
        }     
    }
}

module.exports.corsMiddleware = cors(corsOptions);