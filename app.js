const express = require('express');
const mongoose = require("mongoose");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Load keys 
const keys = require('./config/keys');


// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
  res.send('It works!');
});

// Setup cookie and session middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false

}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.use = req.user || null;
  next();
})

// Use Routes
app.use('/auth', auth); 

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});