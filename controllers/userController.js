const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const validator = require('validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.log_in_get = asyncHandler(async (req, res, next) => {
    if (res.locals.currentUser != undefined)
        res.redirect('/');
    res.render('login_form', {
        title: 'Log In'
    })
});

exports.log_in_post = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message without using flash option
      // re-render the login form with a message
      return res.render('login_form', { 
        title: 'Log-In',
        message: info.message,
        username: req.body.username 
      })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.log_out = asyncHandler(async (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    }); 
});

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  if (res.locals.currentUser != undefined)
      res.redirect('/');
  res.render('signin_form', {
      title: 'Sign In'
  })
});

exports.sign_in_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must contain less than 30 characters")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body("last_name", "Last name must contain less than 30 characters")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body('username', 'Invalid email')
    .trim()
    .isEmail()
    .escape(),
  body('password', 'Password must be at least 8 characters')
    .trim()
    .isLength({ min: 8})
    .escape(),
  body('confirm')
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) throw new Error('Confirm password doesn\'t match');
      return true;
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a user object with escaped and trimmed data.
    let hashed = await bcrypt.hash(req.body.password, 8);
    const user = new User({ 
      first_name: req.body.first_name,
      last_name: req.body.last_name, 
      mail: req.body.username,
      password: hashed,
      status: 'user',
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      user.first_name = validator.unescape(user.first_name);
      user.last_name = validator.unescape(user.last_name);
      user.mail = validator.unescape(user.mail);
      res.render("signin_form", {
        title: "Sign In",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if user with same email already exists.
      const userExists = await User.findOne({ mail: req.body.username }).exec();
      if (userExists) {
        // user exists, redirect to login page.
        return res.render('login_form', { 
          title: 'Log-In',
          message: 'User exists. Try to log-in',
          username: req.body.username 
        })
      } else {
        await user.save();
        // New user saved. Log-in and redirect to home page.
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      }
    }
  }),
];

exports.member_get = asyncHandler(async (req, res, next) => {
  if (res.locals.currentUser == undefined || res.locals.currentUser.status == 'member')
    res.redirect('/');
  res.render('member', {
    title: 'Member Password',
    user: res.locals.currentUser
  })
});

exports.member_post = asyncHandler(async (req, res, next) => {
  if (req.body.password === process.env.MEMBER_PASSWORD) {  
    const user = new User(res.locals.currentUser);
    user.status = 'member';
    await User.findByIdAndUpdate(res.locals.currentUser._id, user, {});
    res.redirect('/');
  }
  else {
    res.render('member', {
      title: 'Member Password',
      user: res.locals.currentUser,
      error: true,
    })
  }
});  

exports.admin_get = asyncHandler(async (req, res, next) => {
  if (res.locals.currentUser == undefined || res.locals.currentUser.status == 'admin')
    res.redirect('/');
  res.render('admin', {
    title: 'Admin Password',
    user: res.locals.currentUser
  })
});

exports.admin_post = asyncHandler(async (req, res, next) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {  
    const user = new User(res.locals.currentUser);
    user.status = 'admin';
    await User.findByIdAndUpdate(res.locals.currentUser._id, user, {});
    res.redirect('/');
  }
  else {
    res.render('member', {
      title: 'Member Password',
      user: res.locals.currentUser,
      error: true,
    })
  }
}); 