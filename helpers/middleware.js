//============================DEPENDECIES======================================
const User = require('../models/user.js');
const cloudinary = require('cloudinary');
//============================USER MIDDLEWARE==================================
function isAuthenticated(req, res, next) {
    if(!req.session.user) { 
        return res.redirect('/login');
    } 
    next(); 
}

async function findUser(req, res, next) {
    const user = await User.findById(req.session.user);
    req.user = user;
    next();
}

async function uploadImage (req, res, next) {
    console.log(req.files.img);
    const img = req.files.img;
    img.mv(`./uploads/${img.name}`);
    try {
        const upload = await cloudinary.uploader.upload(`./uploads/${img.name}`);
        req.imgUrl = upload.secure_url;
    } catch (error) {
        console.log('Something went wrong uploading the image. Error: ', error);
    }
    next();
}

module.exports = {
    isAuthenticated,
    findUser,
    uploadImage,
}