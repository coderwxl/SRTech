var express = require('express');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var jwt = require('jsonwebtoken')
var constant = require('../utils/constant')
var upload = require('../utils/upload')
var path = require('path');
const { v4: uuidv4 } = require('uuid');
var publicfunc = require('../utils/publicfunc')

var router = express.Router();
module.exports = router;

router.post('/login', validate.checkLoginUsername, validate.checkLoginPassword, function(req, res, next) {
  let jwtuuid = uuidv4();
  res.json({ 
    code: constant.CODE_SUCCESS,
    token: jwt.sign(
      { userid: res.locals.userid, username: res.locals.username, role: res.locals.role }, 
      constant.SECRET, 
      { algorithm: 'HS256', expiresIn: constant.EXP, jwtid: jwtuuid })
  })
  publicfunc.addNewToken(jwtuuid)
});

router.post('/register', validate.checkRegisterUsername, function(req, res, next) {
  mysql.query('insert into user(username, password) values(?, ?)', [req.body.username, req.body.password.toLowerCase()]).then(() => {
    res.json({ 
      code: constant.CODE_SUCCESS
    })
  }).catch(err => {
    console.error(err);
      return next(err);
  })
});

router.get('/info', function(req, res, next) {
  mysql.query('select id, username, role, avatar, signature, birth_date, job, address, phone, email from user where id = ?', [req.user.userid]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS,
      data: {
        id: results[0].id,
        username: results[0].username,
        role: results[0].role,
        avatar: results[0].avatar,
        signature: results[0].signature,
        birth_date: results[0].birth_date,
        job: results[0].job,
        address: results[0].address,
        phone: results[0].phone,
        email: results[0].email
      }
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});

router.post('/info', validate.checkEditInfoUsername, async function(req, res, next) {
  try {
    await mysql.query('update user set username=?, signature=?, birth_date=?, job=?, address=?, phone=?, email=? where id=?', 
                     [req.body.username, req.body.signature, req.body.birth_date, req.body.job, req.body.address, req.body.phone, 
                      req.body.email, req.user.userid]);
    res.json({
      code: constant.CODE_SUCCESS
    })
  } catch (err) {
    console.error(err)
    return next(err);
  }
})

router.post('/logout', function(req, res) {
  res.json({
    code: constant.CODE_SUCCESS
  })
  publicfunc.removeToken(req.user.jti)
})

router.post('/avatar', upload.any(), function(req, res, next){
  if (req.files.length === 0) {
    res.status(400).send('no file')
  } else {
    let avatarPath = path.join('/', req.user.userid.toString(), req.files[0].filename)
    mysql.query('update user set avatar=? where id=?', [avatarPath, req.user.userid]).then(results => {
      res.json({
        code: constant.CODE_SUCCESS,
        data: {
          avatar: avatarPath
        }
      })
    }).catch(err => {
      console.error(err)
      return next(err);
    })
  }
})
