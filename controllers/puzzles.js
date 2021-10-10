const puzzleRouter = require('express').Router();
const Puzzle = require('../models/puzzle.js');
const User = require('../models/user.js');
const helper = require('../helpers/middleware.js');
const puzzleSeed = require('../models/seed.js');
//=============================================================================
//ROUTES
//=============================================================================
//==============================SEEDING (DONE TESTED)==========================
puzzleRouter.get('/seed', helper.isAuthenticated, async (req, res) => {
    puzzleSeed.forEach(puzzle => {puzzle.owner_user = req.session.user});
    try {
        await Puzzle.deleteMany({});
        const addedPuzzles = await Puzzle.create(puzzleSeed);
        console.log(addedPuzzles);
    } catch (error) {
        console.log('An error occured adding seed puzzles, see details: ', error);
    }
    
})
//==============================INDEX==========================================
puzzleRouter.get('/dashboard', helper.isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const puzzles = await Puzzle.find({'owner_user': user});
        res.render('dashboard.ejs', {user, puzzles});
    } catch (error) {
        console.log('something went wrong loading dashboard: ', error);
    }
});
//==============================NEW============================================
puzzleRouter.get('/new', helper.isAuthenticated, (req, res) => {
    res.render('new.ejs');
});
//==============================DELETE=========================================
puzzleRouter.delete('/:id', helper.isAuthenticated, (req, res) => {
    res.send("DELETE PUZZLE ROUTE");
});
//==============================UPDATE=========================================
puzzleRouter.put('/:id', helper.isAuthenticated, (req, res) => {
    res.send('UPDATE PUZZLE ROUTE');
});
//==============================CREATE=========================================
puzzleRouter.post('/', helper.isAuthenticated, (req, res) => {
    res.send('CREATE PUZZLE ROUTE')
})
//==============================EDIT===========================================
puzzleRouter.get('/:id/edit', helper.isAuthenticated, (req, res) => {
    res.send('EDIT PUZZLE ROUTE');
})
//==============================SHOW===========================================
puzzleRouter.get('/:id', helper.isAuthenticated, (req, res) => {
    res.send('SHOW PUZZLE ROUTE');
})

module.exports = puzzleRouter; 