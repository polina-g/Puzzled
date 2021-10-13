const puzzleRouter = require('express').Router();
const Puzzle = require('../models/puzzle.js');
const User = require('../models/user.js');
const helper = require('../helpers/middleware.js');
const puzzleSeedA = require('../models/seed.js');
const puzzleSeedB = require('../models/seedB.js');
const puzzleSeedC = require('../models/seedC.js');
//=============================================================================
//ROUTES
//=============================================================================
//==============================SEEDING (DONE, TESTED)=========================
puzzleRouter.get('/seedA', helper.isAuthenticated, async (req, res) => {
    puzzleSeedA.forEach(puzzle => {puzzle.owner_user = req.session.user});
    try {
        await Puzzle.deleteMany({'owner_user': req.session.user});
        const addedPuzzles = await Puzzle.create(puzzleSeedA);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('An error occured adding seed puzzles, see details: ', error);
    }; 
});

puzzleRouter.get('/seedB', helper.isAuthenticated, async (req, res) => {
    puzzleSeedB.forEach(puzzle => {puzzle.owner_user = req.session.user});
    try {
        await Puzzle.deleteMany({'owner_user': req.session.user});
        const addedPuzzles = await Puzzle.create(puzzleSeedB);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('An error occured adding seed puzzles, see details: ', error);
    }; 
});

puzzleRouter.get('/seedC', helper.isAuthenticated, async (req, res) => {
    puzzleSeedC.forEach(puzzle => {puzzle.owner_user = req.session.user});
    try {
        await Puzzle.deleteMany({'owner_user': req.session.user});
        const addedPuzzles = await Puzzle.create(puzzleSeedC);
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
    res.render('./puzzles/new.ejs', {
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
//==============================UPDATE(DONE, TESTED)===========================
puzzleRouter.put('/:id', helper.isAuthenticated, async (req, res) => {
    req.body.exchangeable = !!req.body.exchangeable;
    if (req.body.img == '') {
        const puzzle = await Puzzle.findById(req.params.id);
        req.body.img = puzzle.img;
    }
    
    try {
        const newPuzzle = await Puzzle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
        );
        console.log(newPuzzle);
        res.redirect(`/puzzles/${req.params.id}`);
    } catch (error) {
        console.log('something went wront updating the puzzle. Error: ', error);
    }
});
//==============================CREATE (DONE, TESTED)==========================
puzzleRouter.post('/', helper.isAuthenticated, helper.findUser, helper.uploadImage, async (req, res) => {
    req.body.owner_user = req.session.user;
    req.body.exchangeable = !!req.body.exchangeable;
    if (req.imgUrl) {
        req.body.img = req.imgUrl;
    }
    try {
        const createdPuzzle = await Puzzle.create(req.body);
        res.redirect('/puzzles/dashboard');
    } catch (error) {
        console.log('something went wrong creating new document. Error: ', error);
    }
});
//==============================EDIT(DONE, TESTED)=============================
puzzleRouter.get('/:id/edit', helper.isAuthenticated, helper.findUser, async (req, res) => {
    const puzzle = await Puzzle.findById(req.params.id);
    res.render('./puzzles/edit.ejs', {
        puzzle: puzzle,
        user: req.user,
    });
});
//==============================SHOW(DONE, TESTED)=============================
puzzleRouter.get('/:id', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);
        res.render('./puzzles/show.ejs', {
            puzzle: puzzle,
            user: req.user
        });
    } catch (error) {
        console.log('something went wron showing the puzzle. Error: ', error);
    }
});

module.exports = puzzleRouter; 