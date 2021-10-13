//=============================================================================
//DEPENDENCIES
//=============================================================================
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const methodOverride = require('method-override');
const cloudinary = require('cloudinary').v2;
const expressFileUpload = require('express-fileupload');
const indexController = require('./controllers/index.js');
const userController = require('./controllers/users.js');
const sessionController = require('./controllers/sessions.js');
const puzzleController = require('./controllers/puzzles.js');
const exploreController = require('./controllers/explore.js');
const {DATABASE_URL, PORT, SECRET, CLOUD_NAME, API_KEY, API_SECRET} = process.env;
const app = express();
//=============================================================================
//DATABASE
//=============================================================================
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log('Something went wrong connecting to MongoDB. Error: ' + error));
db.on('connected', () => console.log('MongoDB connected'));
db.on('disconnected', () => console.log('MongoDB disconnected'));
//=============================================================================
//MIDDLEWARE
//=============================================================================
app.use(express.static('public'))
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(expressFileUpload({ createParentPath : true }));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
}));
cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET
  });
app.use('/', indexController);
app.use('/', userController);
app.use('/', sessionController);
app.use('/puzzles', puzzleController);
app.use('/explore', exploreController);
//=============================================================================
//PORT LISTEN
//=============================================================================
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));