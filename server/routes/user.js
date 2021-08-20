var express = require('express');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var jwt = require('jsonwebtoken')
var constant = require('../utils/constant')

var router = express.Router();

router.post('/login', validate.checkLoginUsername, validate.checkLoginPassword, function(req, res, next) {
  res.json({ 
    code: constant.CODE_SUCCESS,
    token: jwt.sign(
      { userid: res.locals.userid, username: res.locals.username, role: res.locals.role }, 
      constant.SECRET, 
      { algorithm: 'HS256', expiresIn: 5*60 })
  })
});

router.post('/register', validate.checkRegisterUsername, function(req, res, next) {
  mysql.query('insert into user(username, password) values(?, ?)', [req.body.username, req.body.password.toLowerCase()], function(err, results) {
    if (err) {
      console.error(err);
      return next(err);
    }

    res.json({ 
      code: constant.CODE_SUCCESS
    })
  })
});

router.get('/info', function(req, res, next) {
  mysql.query('select * from user where id = ?', [req.user.userid], function(err, results) {
    if (err) {
      console.error(err)
      return next(err);
    }

    res.json({
      code: constant.CODE_SUCCESS,
      data: {
        username: results[0].username,
        role: results[0].role,
        avatar: results[0].avatar,
        signature: results[0].signature
      }
    })
  })
});

module.exports = router;
