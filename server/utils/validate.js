var mysql = require('./mysql-common')
var constant = require('./constant')

exports.checkLoginUsername = function(req, res, next) {
  mysql.query('select count(*) as mycount from user where username = ?', [req.body.username], function(error, results) {
    if (error) {
      console.error(error);
      return next(error);      
    } 
    if (results[0].mycount === 0) {
      return res.json({
        code: constant.CODE_NO_USER,
        message: '用户名不存在'
      })
    }
    
    next();
  });
}

exports.checkLoginPassword = function(req, res, next) {
  mysql.query('select * from user where username = ? and password = ?', [req.body.username, req.body.password.toLowerCase()], function(error, results) {
    if (error) {
      console.error(error);
      return next(error);      
    }

    if (results.length === 0) {
      return res.json({
        code: constant.CODE_PASSWORD_ERROR,
        message: '密码错误'
      })
    }
    
    res.locals.userid = results[0].id;
    res.locals.username = results[0].username;
    res.locals.role = results[0].role;
    next();
  });
}

exports.checkRegisterUsername = function(req, res, next) {
  mysql.query('select count(*) as mycount from user where username = ?', [req.body.username], function(error, results) {
    if (error) {
      console.error(error);
      return next(error);      
    } 
    if (results[0].mycount !== 0) {
      res.json({
        code: CODE_USERNAME_REPEAT,
        message: '用户名已经存在'
      })
    }
    
    next();
  });
}