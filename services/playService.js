const Play = require('../models/Play');

async function getAll() {
    return Play.find({ isPublic: true }).sort({ createdAt: -1 }).lean();
};

async function getById(id) {
    return Play.findById(id).lean();
};

async function create(data) {
    const existing = await Play.findOne({ title: data.title }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Play with this name already exists');
    }
    return Play.create(data);
};

async function update(id, data) {
    const play = await Play.findById(id);
    Object.assign(play, data);
    return play.save();
};

async function deleteById(id) {
    return Play.findByIdAndDelete(id);
};

async function like(playId, userId) {
    const play = await Play.findById(playId);
    play.liked.push(userId);
    return play.save();
}

module.exports = { getAll, getById, create, update, deleteById, like };