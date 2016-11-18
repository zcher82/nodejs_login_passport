var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// initialize application
var app = express();

// view engine
app.set('views', path.join(__dirname, 'views')); //tells system we want folder called views to handle our views
app.engine('handlebars', exphbs({defaultLayout: 'layout'})); //set handelbars as app.engine and default layout as layout...so called "layout handlebars"
app.set('view engine', 'handlebars'); //app.set view engine to handlebars

// bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public'))); //sets our static folder as "public"

// middleware for express session
app.use(session({
  secret: 'secret',
  saveUnitialiazed: true,
  resave: true
}));

//passport initialize
app.use(passport.initialize());
app.use(passport.session());

// middleware for express validator (from github page)
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// middleware for connect flash
app.use(flash());

// global variables for flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', routes);
app.use('/users', users);

// set passport
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
