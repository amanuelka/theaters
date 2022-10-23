const { hasUser, isOwner } = require('../middlewares/guards');
const { parseError } = require('../middlewares/parsers');
const preload = require('../middlewares/preloader');
const { create, getById, deleteById, update, like } = require('../services/playService');

const playController = require('express').Router();

playController.get('/create', (req, res) => {
    res.render('create');
});

playController.post('/create', hasUser(), async (req, res) => {
    const data = { ...req.body, isPublic: Boolean(req.body.isPublic), author: req.user._id };
    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await create(data);
        res.redirect('/');

    } catch (err) {

        res.render('create', { errors: parseError(err), ...data });
    }
});

playController.get('/:id', async (req, res) => {
    const play = await getById(req.params.id);

    if (req.user) {
        play.isAuthor = play.author == req.user._id;
        play.isLiked = play.liked.some(u => u._id == req.user._id);
    }
    res.render('details', { ...play });
});

playController.get('/:id/delete', hasUser(), preload(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/');
});

playController.get('/:id/edit', hasUser(), preload(), isOwner(), async (req, res) => {
    const play = res.locals.play;
    res.render('edit', { ...play });
});

playController.post('/:id/edit', hasUser(), preload(), isOwner(), async (req, res) => {

    try {
        await update(req.params.id, { ...req.body, isPublic: Boolean(req.body.isPublic), _id: req.params.id });
        res.redirect(`/play/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), ...req.body });
    }
});

playController.get('/:id/like', hasUser(), async (req, res) => {
    const play = await getById(req.params.id);

    if (play.author != req.user._id && play.liked.some(u => u._id == req.user._id) == false) {
        await like(req.params.id, req.user._id);
    }
    res.redirect(`/play/${req.params.id}`);
});

module.exports = playController;
