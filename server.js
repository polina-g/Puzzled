//=============================================================================
//DEPENDENCIES
//=============================================================================
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const userController = require('./controllers/users.js');
const sessionController = require('./controllers/sessions.js');
const PORT = process.env.PORT;
const app = express();
//=============================================================================
//DATABASE
//=============================================================================
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log('Something went wrong connecting to MongoDB. Error: ' + error));
db.on('connected', () => console.log('MongoDB connected'));
db.on('disconnected', () => console.log('MongoDB disconnected'));
//=============================================================================
//MIDDLEWARE
//=============================================================================
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use('/', userController);
app.use('/', sessionController);
//=============================================================================
//PORT LISTEN
//=============================================================================
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));