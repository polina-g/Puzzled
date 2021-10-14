const indexRouter = require('express').Router();
const helper = require('../helpers/middleware.js');
//=============================================================================
//ROUTES
//=============================================================================
indexRouter.get('/', helper.findUser, (req, res) => {
    console.log(req.user);
    res.render('index.ejs', {
        user: req.session.user
    });
});

module.exports = indexRouter; 