const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
//=============================================================================
//ROUTES
//=============================================================================
//==========================NEW REGISTRATION===================================
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    res.send(req.body);
});

module.exports = userRouter;