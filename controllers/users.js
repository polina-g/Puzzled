const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
//=============================================================================
//ROUTES
//=============================================================================
//==========================CLEAR USERS========================================
userRouter.get('/clear', async (req, res) => {
    await User.deleteMany({});
    res.send('Succesfully Deleted Users');
})
//==========================INDEX (DASHBOARD)==================================
userRouter.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        res.render('dashboard.ejs', {user});
    } catch (error) {
        console.log('something went wrong loading dashboard: ', error);
    }
})
//==========================NEW REGISTRATION===================================
userRouter.get('/signup', (req, res) => {
    res.render('./users/signup.ejs', {
        user: req.session.user});
})
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const createdUser = await User.create(req.body);
    res.redirect('/')
});

//============================USER MIDDLEWARE==================================
function isAuthenticated(req, res, next) {
    if(!req.session.user) { 
        return res.redirect('/login');
    } 
    next(); 
}

module.exports = userRouter;