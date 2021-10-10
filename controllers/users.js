const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Puzzle = require('../models/puzzle.js');
//=============================================================================
//ROUTES
//=============================================================================
//==========================CLEAR USERS DB=====================================
userRouter.get('/clear', async (req, res) => {
    await User.deleteMany({});
    res.send('Succesfully Deleted Users');
})
//==========================NEW REGISTRATION===================================
userRouter.get('/signup', (req, res) => {
    res.render('./users/signup.ejs', {
        user: req.session.user});
})
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    try {
        const createdUser = await User.create(req.body);
        req.session.user = createdUser._id;
        res.redirect('/dashboard')
    } catch (error) {
        console.log('something went wrong when adding registration ', + error);
    }
});

module.exports = userRouter;