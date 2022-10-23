const { Schema, model, Types } = require('mongoose');

const playSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, maxlength: [50, 'Description cannot be more than 50 characters long'] },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    author: { type: Types.ObjectId, ref: 'User' },
    liked: { type: [Types.ObjectId], ref: 'User', default: [] },
    likesCount: { type: Number, default: 0 }
});

const Play = model('Play', playSchema);
module.exports = Play;