var mysql = require('./mysql-common')
var constant = require('./constant')

exports.checkLoginUsername = function(req, res, next) {
  mysql.query('select count(*) as mycount from user where username = ?', [req.body.username]).then((results) => {
    if (results[0].mycount === 0) {
      return res.json({
        code: constant.CODE_NO_USER,
        message: '用户名不存在'
      })
    }
    next();
  }).catch(err => {
    console.error(error);
    return next(error);   
  })
}

exports.checkLoginPassword = function(req, res, next) {
  mysql.query('select * from user where username = ? and password = ?', [req.body.username, req.body.password.toLowerCase()]).then(results => {
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

  }).catch(err => {
    console.error(error);
    return next(error);      
  })
}

exports.checkRegisterUsername = function(req, res, next) {
  mysql.query('select count(*) as mycount from user where username = ?', [req.body.username]).then(results => {
    if (results[0].mycount !== 0) {
      res.json({
        code: constant.CODE_USERNAME_REPEAT,
        message: '用户名已经存在'
      })
    }
    
    next();
  }).catch(err => {
    console.error(error);
    return next(error);      
  })
}

exports.checkEditInfoUsername = function(req, res, next) {
  mysql.query('select count(*) as mycount from user where username = ? and id != ?', [req.body.username, req.user.userid]).then(results => {
    if (results[0].mycount !== 0) {
      res.json({
        code: constant.CODE_USERNAME_REPEAT,
        message: '用户名已经存在'
      })
    }
  
    next();
  }).catch(err => {
    console.error(error);
    return next(error);      
  })
}


exports.checkAddFriendName = async function(req, res, next) {
  try {
    let rows = await mysql.query('select * from user where username = ?', [req.body.friendName]);
    if (0 === rows.length) {
      return res.json({
        code: constant.CODE_NO_USER,
        message: '用户名不存在'
      })
    } else {
      res.locals.friendID = rows[0].id;
      rows = await mysql.query('select * from friend where user_id = ? and friend_id = ?', [req.user.userid, res.locals.friendID]);
      if (0 !== rows.length) {
        return res.json({
          code: constant.CODE_FRIEND_ALREADY_EXIST,
          message: '该用户已经添加'
        })
      }
    }

    next();
  } catch (err) {
    console.error(error);
    return next(error);      
  }
}