const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const validator = require('validator');

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user').limit(50).exec();
  res.render('index', {
    title: 'Members Only',
    messages: messages, 
    user: res.locals.currentUser
  })
});

exports.message_get = asyncHandler(async (req, res, next) => {
  if (res.locals.currentUser == undefined)
      res.redirect('/');
  res.render('message_form', {
      title: 'Post Message'
  })
});

exports.message_post = [
  // Validate and sanitize fields.
  body("title", "Title must contain less than 50 characters")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body("text", "Message must contain less than 1500 characters")
    .trim()
    .isLength({ max: 1500 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a message object with escaped and trimmed data.
    const message = new Message({ 
      title: req.body.title,
      text: req.body.text, 
      user: res.locals.currentUser._id,
      timestamp: new Date(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      message.title = validator.unescape(message.title);
      message.text = validator.unescape(message.text);
      res.render("message_form", {
        title: "Post Message",
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
        await message.save();
        return res.redirect('/');
      }    
  }),
];

exports.delete = asyncHandler (async (req, res, err) => {
  if (res.locals.currentUser.status == 'admin') {
    await Message.findByIdAndRemove(req.params.id);
  }
  res.redirect('/')
})