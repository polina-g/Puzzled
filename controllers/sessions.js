const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const sessionsRouter = express.Router();

//==========================LOGIN PAGE=========================================
//==========================LOGIN ROUTE========================================
//==========================LOGOUT ROUTE=======================================

module.exports = sessionsRouter; 