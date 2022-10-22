const { Schema, model, Types } = require('mongoose');

const playSchema = new Schema({

});

const Play = model('Play', playSchema);
module.exports = Play;