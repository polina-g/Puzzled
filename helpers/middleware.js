//============================DEPENDECIES======================================
const User = require('../models/user.js');
const cloudinary = require('cloudinary');
//============================USER MIDDLEWARE==================================
function isAuthenticated(req, res, next) {
    if(!req.session.user) { 
        return res.redirect('/login');
    };
    next(); 
};

async function findUser(req, res, next) {
    const user = await User.findById(req.session.user);
    req.user = user;
    next();
};

async function uploadImage (req, res, next) {
    //Case - files does not exist
    if(!req.files) {
        req.imgUrl = null;
        return next();
    };
    
    //When files does exist in the request body
    const img = req.files.uimg;
    img.mv(`./uploads/${img.name}`);
    try {
        const upload = await cloudinary.uploader.upload(`./uploads/${img.name}`);
        req.imgUrl = upload.secure_url;
    } catch (error) {
        res.render('error.ejs', {error: 'Oopps, something went wrong! Please try again latet!'});
    };
    next();
};

  
module.exports = {
    isAuthenticated,
    findUser,
    uploadImage,
};