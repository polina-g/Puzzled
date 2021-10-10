const puzzleRouter = require('express').Router();
const Puzzle = require('../models/puzzle.js');
const User = require('../models/user.js');
const helper = require('../helpers/middleware.js');
const puzzleSeed = require('../models/seed.js');
//=============================================================================
//ROUTES
//=============================================================================
//==============================SEEDING (DONE, TESTED)=========================
puzzleRouter.get('/seed', helper.isAuthenticated, async (req, res) => {
    puzzleSeed.forEach(puzzle => {puzzle.owner_user = req.session.user});
    try {
        await Puzzle.deleteMany({});
        const addedPuzzles = await Puzzle.create(puzzleSeed);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('An error occured adding seed puzzles, see details: ', error);
    }; 
});
//==============================INDEX (DONE, TESTED)===========================
puzzleRouter.get('/dashboard', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        const puzzles = await Puzzle.find({'owner_user': req.user});
        res.render('./puzzles/dashboard.ejs', {
            user: req.user, 
            puzzles: puzzles
        });
    } catch (error) {
        console.log('something went wrong loading dashboard: ', error);
    };
});
//==============================NEW (DONE, TESTED)=============================
puzzleRouter.get('/new', helper.isAuthenticated, helper.findUser, (req, res) => { 
    res.render('/puzzles/new.ejs', {
        user: req.user
    });
});
//==============================DELETE(DONE, TESTED)===========================
puzzleRouter.delete('/:id', helper.isAuthenticated, async (req, res) => {
    try {
        await Puzzle.findByIdAndDelete(req.params.id);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('Something went wrong deleting the puzzle. Error: ', error);
    };
});
//==============================UPDATE=========================================
puzzleRouter.put('/:id', helper.isAuthenticated, (req, res) => {
    res.send('UPDATE PUZZLE ROUTE');
});
//==============================CREATE (DONE, TESTED)==========================
puzzleRouter.post('/', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        req.body.owner_user = req.session.user;
        req.body.exchangeable = !!req.body.exchangeable;
        const createdPuzzle = await Puzzle.create(req.body);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('something went wrong creating new document. Error: ', error);
    }
});
//==============================EDIT===========================================
puzzleRouter.get('/:id/edit', helper.isAuthenticated, helper.findUser, (req, res) => {
    res.render('/puzzles/edit.ejs')
});
//==============================SHOW(DONE, TESTED)=============================
puzzleRouter.get('/:id', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);
        res.render('/puzzles/show.ejs', {
            puzzle: puzzle,
            user: req.user
        });
    } catch (error) {
        console.log('something went wron showing the puzzle. Error: ', error);
    }
});

module.exports = puzzleRouter; 