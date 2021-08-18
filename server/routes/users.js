var express = require('express');
var mysql = require('../utils/mysql-common')

var router = express.Router();

router.get('/login', function(req, res, next) {
  var sqlstr = `select count(*) from user where username=${req.body.username}`;
  mysql.query(sqlstr, function(error, results, fileds) {
    if (error) return next(error);
    console.log(results);
    console.log(fileds)
  })
});

router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getInfo', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
