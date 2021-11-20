var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJwt = require('express-jwt')
// var cors = require('cors');

var constant = require('./utils/constant')
var usersRouter = require('./routes/user');
var friendRouter = require('./routes/friend');
var chatRouter = require('./routes/chat');

var app = express();

// const corsConfig = {
//   origin: true,
//   methods: ["GET","POST"],
//   credentials: true,
//   maxAge: 60
// };
// app.use(cors(corsConfig));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'userdata')));

// token吊销暂时先放到前台做 isRevoked: usersRouter.removeToken 
app.use(expressJwt({ secret: constant.SECRET, algorithms: ['HS256'] }).unless({path: ['/user/register', '/user/login'], ext: ['.html', '.htm', '.css', '.js', '.jpg', '.png', '.ico']}));

app.use(logger('dev')); //, { immediate: true }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', usersRouter);
app.use('/friend', friendRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err)
  if (err.name === 'UnauthorizedError') {
    console.error(req.path + ' UnauthorizedError')
    res.json({
      code: constant.INVALID_TOKEN,
      message: '无效的Token'
    })
  } else {
    res.status(err.status || 500);
    res.end();
  }
});

module.exports = app;
