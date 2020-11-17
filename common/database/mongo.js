const mongoose = require('mongoose');
const constants = require('../enum/constants')

const connetDB = ()=>{
    console.log(global)
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).catch(err => {
        console.log(err);
        process.env[constants.MONGO_CONNECT_ERROR] = 1;
    })

    mongoose.connection.on('connected', () => {
        console.log('Database connected', process.env.MONGO_URI)
        process.env[constants.MONGO_CONNECT_ERROR] = 0;
    })

    mongoose.connection.on('disconnected', () => {
        !process.env[constants.MONGO_CONNECT_ERROR] && console.log('Database disconnected', process.env.MONGO_URI)
        process.env[constants.MONGO_CONNECT_ERROR] = 1;
    })
}

module.exports = connetDB




