var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')

var usersRouter = require('./routes/users');

var app = express();

app.use(jwt({ secret: 'myson-wangsirui', algorithms: ['HS256']}).unless({path: ['/user/register', '/user/login']}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  } else {
    res.status(err.status || 500);
    res.end();
  }
});

module.exports = app;
