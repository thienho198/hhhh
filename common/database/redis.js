const redis = require('redis');
const constants = require('../enum/constants')

/**
 * constructor
 */
var redisInstance = null;

function Redis(){
   this.client = redis.createClient();
   this.client.on("error", function(error) {
    console.log(error);
    process.env[constants.REDIS_CONNECT_ERROR] = 1;
  });
  this.client.on("connect", () => {
    process.env[constants.REDIS_CONNECT_ERROR] = 0;
    console.log('Database connected', process.env.REDIS_URI)
  })
}


module.exports = {
    getInstance: function () {
        if(!redisInstance){
            redisInstance = new Redis();
        }
        return redisInstance;
    }
};
