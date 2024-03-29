const { isEmail } = require('validator');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 30 },
  last_name: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true, minLength: 8 },
  mail: { 
    type: String, 
    lowercase: true,
    unique: true, 
    required: true, 
    maxLength: 50,
    validate: [ isEmail, 'invalid email' ]
  },
  status: { 
    type: String, 
    required: true,
    enum: [ 'user', 'member', 'admin'],
    default: 'user'
  },
});

UserSchema.virtual('name').get(function() {
    return `${this.first_name} ${this.last_name}`;
})

UserSchema.virtual('status_formatted').get(function() {
  return this.status[0].toUpperCase() + this.status.substring(1);
})

module.exports = mongoose.model("User", UserSchema);
