const indexRouter = require('express').Router();
//=============================================================================
//ROUTES
//=============================================================================
indexRouter.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user
    });
})

module.exports = indexRouter; 