const { getAll } = require('../services/playService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const plays = await getAll();
    res.render('home', { plays });
});

module.exports = homeController;