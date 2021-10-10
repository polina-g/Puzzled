//============================DEPENDECIES======================================
const User = require('../models/user.js');
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

module.exports = {
    isAuthenticated,
    findUser
}