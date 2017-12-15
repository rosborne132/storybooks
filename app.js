const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

// Load User Model
require('./models/User');

// Load Story Model
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Load keys 
const keys = require('./config/keys');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Setup cookie and session middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index); 
app.use('/auth', auth); 
app.use('/stories', stories); 


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});