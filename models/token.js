const moongoose = require('mongoose');

const tokenSchema = new moongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Token = moongoose.model('Token', tokenSchema);

module.exports = Token;