#! /usr/bin/env node

console.log(
    'This script populates some test users and messages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/user");
  const Message = require("./models/message");
  const bcrypt = require('bcryptjs');

  const users = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function userCreate(first_name, last_name, password, mail, status) {
    let hashed = await  bcrypt.hash(password, 8);
    const user = new User({ 
      first_name: first_name,
      last_name: last_name,
      password: hashed,
      mail: mail,
      status: status,
    });
    await user.save();
    users.push(user);
    console.log(`Added user: ${first_name}`);
  }
  
  async function messageCreate(title, text, user) {
    const message = new Message({ 
      title: title, 
      text: text,
      author: user,
      timestamp: new Date(), 
    });
    await message.save();
    console.log(`Added message: ${title}`);
  }
    
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
      userCreate('carlos', 'valdivia', 'password', 'fakeuser@notreal.com', 'user'),
      userCreate('carlos', 'valdivia', 'password', 'fakemember@notreal.com', 'member'),
      userCreate('carlos', 'valdivia', 'password', 'fakeadmin@notreal.com', 'admin'),
    ]);
  }
  
  async function createMessages() {
    console.log("Adding messages");
    await Promise.all([
      messageCreate('dummy', 'dummy text dummy text dummy text dummy text dummy text dummy text dummy text', users[0]),
      messageCreate('dummy', 'dummy text dummy text dummy text dummy text dummy text dummy text dummy text', users[1]),
      messageCreate('dummy', 'dummy text dummy text dummy text dummy text dummy text dummy text dummy text', users[2]),
    ]);
  }
  