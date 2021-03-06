const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const sessionsRouter = express.Router();

//==========================LOGIN PAGE (NEW)===================================
sessionsRouter.get('/login', (req, res) => {
    res.render('sessions/login.ejs', {
        user: req.session.user, 
        error: null
    });
});
//==========================LOGIN ROUTE========================================
sessionsRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user._id;
            res.redirect('/puzzles/dashboard');
        } else {
            res.render('./sessions/login.ejs', {
                error: 'Invalid Credentials', 
                user: req.session.user
            });
        };
    } catch (error) {
        res.render('error.ejs', {error: 'Oopps, something went wrong logging in. Please try again later!'});
    };
});
//==========================LOGOUT ROUTE=======================================
sessionsRouter.delete('/logout', async (req, res) => {
    try {
        await req.session.destroy();
        res.redirect('/')
    } catch (error) {
        res.render('error.ejs', {error: 'Oopps, something went wrong. Please try again later!'});
    }
});

module.exports = sessionsRouter; 