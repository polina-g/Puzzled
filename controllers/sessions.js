const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const sessionsRouter = express.Router();

//==========================LOGIN PAGE=========================================
//==========================LOGIN ROUTE========================================
sessionsRouter.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user._id;
        res.redirect('/');
    } else {
        res.render('/login', {
            error: 'Invalid Username or Password'
        });
    };

});
//==========================LOGOUT ROUTE=======================================
sessionsRouter.get('/logout', async (req, res) => {
    await req.session.destroy;
    res.redirect('/')
})
module.exports = sessionsRouter; 