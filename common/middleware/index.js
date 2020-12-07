const client = require('../database/redis').getInstance().client;
const originController = require('../../auth-service/controller/originController');
const constants = require('../enum/constants');
const cors = require('cors');

module.exports.cacheMiddleware = (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
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

const funcForCors = (origin, whitelist, callback)=>{
    if (whitelist.indexOf(origin) !== -1) {
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