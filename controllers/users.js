const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Puzzle = require('../models/puzzle.js');
const helper = require('../helpers/middleware.js')
//=============================================================================
//ROUTES
//=============================================================================
//==========================CLEAR USERS DB=====================================
userRouter.get('/clear', async (req, res) => {
    await User.deleteMany({});
    res.send('Succesfully Deleted Users');
})
//==========================NEW REGISTRATION===================================
userRouter.get('/signup', (req, res) => {
    res.render('./users/signup.ejs', {
        user: req.session.user});
})
//==========================CREATE REGISTRATION================================
userRouter.post('/signup', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    try {
        const createdUser = await User.create(req.body);
        req.session.user = createdUser._id;
        res.redirect('puzzles/dashboard')
    } catch (error) {
        console.log('something went wrong when adding registration ', + error);
    }
});
//==========================ADD PUZZLE TO EXCHANGE INVENTORY===================
userRouter.put('/:id/add', helper.isAuthenticated, helper.findUser, async (req, res) => {
    try {
    //TODO
        //Find relevant puzzle from req.param.id
        const puzzle = await  Puzzle.findById(req.params.id);
        //Change isAvailable to false in the puzzle
        puzzle.isAvailable = false;
        puzzle.save();
        //Update User model to add puzzle object in the puzzle array
        req.user.exchange_inventory.push(puzzle);
        req.user.save();
        //Redirect to show all inventory
        res.redirect('/inventory');
    } catch (error) {
        console.log('Somethng went wrong adding puzzle to exchange inventory! Error: ', error);
    }


});
//==========================ADD PUZZLE TO EXCHANGE INVENTORY===================
userRouter.get('/inventory', helper.isAuthenticated, helper.findUser, (req, res) => {
    res.render('./users/inventory.ejs');
})




module.exports = userRouter;