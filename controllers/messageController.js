const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const User = require('../models/user');

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user').limit(50).exec();
  res.render('index', {
    title: 'Members Only',
    messages: messages, 
    user: req.user
  })
});
