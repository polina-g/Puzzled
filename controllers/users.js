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
//==========================NEW REGISTRATION===================================
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const createdUser = await User.create(req.body);
    res.redirect('/')
});

module.exports = userRouter;