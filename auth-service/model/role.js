const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{type: String},
    resources:
        [
            {
                name:{type: String, require: true, unique: true},
                create:{type: Boolean, default: false},
                read:{type: Boolean, default: false},
                update:{type: Boolean, default: false},
                delete:{type: Boolean, default: false}
            }
        ]
},{
    timestamps: true
});

module.exports = mongoose.model('role', schema);
