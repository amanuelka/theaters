const { getById } = require('../services/playService');

function preload() {
    return async function (req, res, next) {
        res.locals.play = await getById(req.params.id);
        next();
    };
}

module.exports = preload;