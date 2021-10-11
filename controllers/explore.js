const exploreRouter = require('express').Router();
const Puzzle = require('../models/puzzle.js');
const User = require('../models/user.js');
const helper = require('../helpers/middleware.js');
//=============================================================================
//ROUTES
//=============================================================================
//==============================INDEX==========================================
exploreRouter.get('/', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        const allPuzzles = await Puzzle.find({'exchangeable': 'true', 'isAvailable': 'true'});
        res.render('./explore/explore.ejs', {
            puzzles: allPuzzles,
            user: req.user
        });
    } catch (error) {
        console.log('Something went wrong loading the explore page. Error: ', error);
    };
});
//==============================SHOW===========================================
exploreRouter.get('/:id', helper.isAuthenticated, async (req, res) => {
    res.send('SHOW EXPLORE PUZZLES ROUTE');
});




module.exports = exploreRouter; 


