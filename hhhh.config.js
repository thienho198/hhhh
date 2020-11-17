module.exports = {
    apps: [{
        name: "hhhh",
        script: "./server.js",
        env: {
          PORT: 3005,
          NODE_ENV: "development",
          MONGO_URI: "mongodb://dev_netaland:dev_netaland@localhost:27017/hhhh",
        //   REDIS_URI: "redis://:123456@localhost:6379",
          SCOPE: "hhhh",
          PREFIX_CACHE: "hhhh",
          BASIC_TOKEN: "Basic ZDAwYjcwNGEtOWZjMC00NjI4LTgzZTItMjU4NmE2ZTJjNGMxOjMyMTcxOGI3LTM3YmItNDEwNi1iYThmLTliMjdlNDE1OTc3YQ=="
        },
        env_production: {
          PORT: 3000,
          NODE_ENV: "production",
          MONGO_URI: "mongodb://hhhh:hhhh@localhost:27017/hhhh",
        //   REDIS_URI: "redis://:123456@localhost:6379",
          SCOPE: "hhhh",
          PREFIX_CACHE: "hhhh",
          BASIC_TOKEN: "Basic ZDAwYjcwNGEtOWZjMC00NjI4LTgzZTItMjU4NmE2ZTJjNGMxOjMyMTcxOGI3LTM3YmItNDEwNi1iYThmLTliMjdlNDE1OTc3YQ=="
        }
      }]
}