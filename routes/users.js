const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if (err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if(err) return done(err);
      console.log('Match', isMatch);
      if(isMatch){
      return done(null, user);
      } else {
        console.log('Here!')
      return done(null, false, {message: 'Invalid Password'});
    }
    })
  })
}));
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.post('/register', upload.single('profileimage'), function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let profileimage = 'noimage.jgp';
  if(req.file){
    console.log('Uploading File....');
    profileimage = req.file.filename;
  }else {
    console.log('No File Uploaded...');
  }
  // Form Validator

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password', 'Passwords do not match').equals(req.body.password);

  // Check Errors
  // let errors =  req.getValidationResult();
  let errors =  req.validationErrors();


  if (errors){
    res.render('register', {errors: errors});
    console.log(errors);
  }else {
    console.log(profileimage)
    let newUser = new User({
      name,
      email,
      username,
      password,
      profileimage
    });
    User.creatUser(newUser, function(err, user){
      if(err) throw err;
    });

    req.flash('success', 'You are now registered and can log in');

    res.location('/');
    res.redirect('/');
  }
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or password'}), function(req, res, next) {
  // If this function gets called, authentication was successful.
   // `req.user` contains the authenticated user.
   req.flash('succces', 'you are now logged in')
   res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('succces', 'You are now logged out');
  res.redirect('/users/login');
});
module.exports = router;
