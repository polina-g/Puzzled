const puzzleRouter = require('express').Router();
const Puzzle = require('../models/puzzle.js');
const User = require('../models/user.js');
const helper = require('../helpers/middleware.js');
const puzzleSeedA = require('../models/seed.js');
const puzzleSeedB = require('../models/seedB.js');
const puzzleSeedC = require('../models/seedC.js');
let error = '';
//=============================================================================
//ROUTES
//=============================================================================
//==============================INDEX (DONE, TESTED)===========================
puzzleRouter.get('/error', (req, res) => {
    error = "something went wrong"
    res.render('error.ejs', {error});
})
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
puzzleRouter.put('/:id', helper.isAuthenticated, helper.uploadImage, async (req, res) => {
    req.body.exchangeable = !!req.body.exchangeable;
    //Logic for updating the image based on user input - URL or upload
    console.log('req.imgURL: ', req.imgUrl, 'req.img', req.img);
    if (!req.imgUrl && req.body.img == '') {
        const puzzle = await Puzzle.findById(req.params.id);
        req.body.img = puzzle.img;    
    } else if (req.imgUrl) {
        req.body.img = req.imgUrl;
    };

    //Delete unnecessary second image name
    delete req.body.uimg;
    
    try {
        await Puzzle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
        );
        res.redirect(`/puzzles/${req.params.id}`);
    } catch (error) {
        console.log('something went wront updating the puzzle. Error: ', error);
    };
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
    //I know this is super cumbersome, but I couldnt get the promises to work correctly when I separated the second async User search into a helper function! This is the only way I was able to get it to work. Feedback and suggestions would be very appreaciated, if possible!
    try {
        //Find the puzzle based on the query Id
        const puzzle = await Puzzle.findById(req.params.id);
        if (!puzzle.borrowed_user) {
            return res.render('./puzzles/show.ejs', {
                puzzle: puzzle,
                user: req.user
            });
        };

        //Find the user stored as borrowed_user in found puzzle's Schema
        try {
            const borrowingUser = await User.findById(puzzle.borrowed_user);
            
            //Render page
            res.render('./puzzles/show.ejs', {
                puzzle: puzzle,
                user: req.user,
                borrowed_by: borrowingUser.username
            });
        } catch (error) {
            console.log('Something went wrong when finding the user borrowing the puzzle', error);
        };
    } catch (error) {
        console.log('something went wrong showing the puzzle. Error: ', error);
    };
});

module.exports = puzzleRouter; 