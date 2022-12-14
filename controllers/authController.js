const { body, validationResult } = require('express-validator');
const { parseError } = require('../middlewares/parsers');
const { isGuest, hasUser } = require('../middlewares/guards');
const { register, login } = require('../services/userService');

const authController = require('express').Router();

authController.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

authController.post('/register', isGuest(),
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username may contain only English letters and numbers'),
    body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
        .isAlphanumeric().withMessage('Password may contain only English letters and numbers'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            if (req.body.password != req.body.repass) {
                throw new Error('Passwords don\'t match');
            }
            const token = await register(req.body.username, req.body.password);

            res.cookie('token', token);
            res.redirect('/');
        }
        catch (error) {
            const errors = parseError(error);
            res.render('register', {
                errors,
                body: {
                    username: req.body.username
                }
            });
        }
    });

authController.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('login', { errors, body: { username: req.body.username } });
    }
});

authController.get('/logout', hasUser(), (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;