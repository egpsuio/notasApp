const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup', (req, res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <=0 ){
        errors.push({text: 'Por favor ingrese un nombre de usuario'});
    }
    if (password != confirm_password) {
        errors.push({text: 'Los passwords no coinciden'});
    }
    if (password.length < 4) {
        errors.push({text: 'El password debe contener al menos 4 carateres'});
    }
    if (errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'El email ya existe');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg','Usuario registrado');
            res.redirect('/users/signin');
        }
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;