const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
const errors = [];
if (!title) {
    errors.push({text: 'Por favor escriba un título'});
}
if(!description) {
    errors.push({text: 'Por favor escriba una descripción'});
}
if(errors.length > 0) {
    res.render('notes/new-note', {
    errors,
    title,
    description
    });
} else {
    const NewNote = new Note({title, description});
    NewNote.user = req.user.id;
    await NewNote.save();
    req.flash('success_msg','Nota guardada exitosamente');
    res.redirect('/notes');
} 
});


router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg','Nota modificada exitosamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Nota borrada exitosamente');
    res.redirect('/notes');
});


module.exports = router;
