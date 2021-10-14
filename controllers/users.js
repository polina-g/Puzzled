const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Puzzle = require('../models/puzzle.js');
const helper = require('../helpers/middleware.js');
//=============================================================================
//ROUTES
//=============================================================================
//==========================NEW REGISTRATION===================================
userRouter.get('/signup', (req, res) => {
    res.render('./users/signup.ejs', {
        user: req.session.user,
        error: null
    });
});
//==========================REMOVE FROM INVENTORY==============================
userRouter.delete('/inventory/:index/:puzzleId', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.puzzleId);
        puzzle.isAvailable = true;
        puzzle.borrowed_user = null;
        await puzzle.save();
        req.user.exchange_inventory.splice(req.params.index, 1); 
        await req.user.save();
        res.redirect('/inventory');     
    } catch (error) {
        res.render('error.ejs', {error: 'Oops! Something went wrong... please try again later!'});
    };
});
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', async (req, res) => {
    //Check username is not taken
    try {
        const repeatedUsername = await User.find({'username': req.body.username});
        if (repeatedUsername.length !== 0) {
            return res.render('./users/signup.ejs', {
                user: req.session.user,
                error: 'Username not available'
            });
        };        
    } catch (error) {
        res.render('error.ejs', {error: 'Oops! Something went wrong... please try again later!'});
    };
    
    //Hash password and create new user
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    try {
        const createdUser = await User.create(req.body);
        req.session.user = createdUser._id;
        res.redirect('puzzles/dashboard');
    } catch (error) {
        res.render('error.ejs', {error: 'Oops! Something went wrong... please try again later or use the guest account!'});
    };
});
//==========================UPDATE EXCHANGE INVENTORY==========================
userRouter.put('/:id/add', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
        //Find relevant puzzle from req.param.id
        const puzzle = await  Puzzle.findById(req.params.id);
        //Change isAvailable to false in the puzzle and add current user as the borrower. 
        puzzle.isAvailable = false;
        puzzle.borrowed_user = req.user._id;
        await puzzle.save();
        //Update User model to add puzzle object in the puzzle array
        req.user.exchange_inventory.push(puzzle);
        await req.user.save();
        //Redirect to show all inventory
        res.redirect('/inventory');
    } catch (error) {
        res.render('error.ejs', {error: 'Oops! Something went wrong... please try again later!'});
    };
});
//==========================ADD PUZZLE TO EXCHANGE INVENTORY===================
userRouter.get('/inventory', helper.isAuthenticated, helper.findUser, (req, res) => {
    res.render('./users/inventory.ejs', {
        user: req.user
    });
});

module.exports = userRouter;