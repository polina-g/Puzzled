const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const sessionsRouter = express.Router();

//==========================LOGIN PAGE (NEW)===================================
sessionsRouter.get('/login', (req, res) => {
    res.render('sessions/login.ejs', {
        user: req.session.user
    });
})
//==========================LOGIN ROUTE========================================
sessionsRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user._id;
            res.redirect('/puzzles/dashboard');
        } else {
            res.render('./sessions/login.ejs', {
                error: 'Invalid Username or Password', 
                user: req.session.user
            });
        };
    } catch (error) {
        console.log('error: ', error)
    }


});
//==========================LOGOUT ROUTE=======================================
sessionsRouter.delete('/logout', async (req, res) => {
    try {
        await req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log('something went wrong logging out: ', error);
    }
})
module.exports = sessionsRouter; 