  const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});

const User = require('../models/user');
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

module.exports = router;
