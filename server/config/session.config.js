const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('./db/connection');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      // cookie expires in 12h
      maxAge: 12 * 60 * 60 * 1000
  },
  name: 'id',
  saveUninitialized: false,
  store: new MongoStore({ 
      mongooseConnection: mongoose.connection,
      // session expires in 12h as
      ttl: 12 * 60 * 60 * 1000
    })
});