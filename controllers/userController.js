const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const passport = require("passport");

exports.log_in_get = asyncHandler(async (req, res, next) => {
    res.render('user_form', {
        title: 'Log In'
    })
});

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in"
});

exports.log_out = asyncHandler(async (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    }); 
})

  