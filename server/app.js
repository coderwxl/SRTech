var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJwt = require('express-jwt')
var constant = require('./utils/constant')

var usersRouter = require('./routes/user');

var app = express();

app.use(expressJwt({ secret: constant.SECRET, algorithms: ['HS256']}).unless({path: ['/user/register', '/user/login']}));

app.use(logger('dev', { immediate: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);


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
