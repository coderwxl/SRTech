var express = require('express');
var mysqlquery = require('../utils/mysql-common')
var validate = require('../utils/validate')
var jwt = require('jsonwebtoken')
var constant = require('../utils/constant')
var upload = require('../utils/upload')
var path = require('path');

var router = express.Router();
module.exports = router;

router.post('/login', validate.checkLoginUsername, validate.checkLoginPassword, function(req, res, next) {
  res.json({ 
    code: constant.CODE_SUCCESS,
    token: jwt.sign(
      { userid: res.locals.userid, username: res.locals.username, role: res.locals.role }, 
      constant.SECRET, 
      { algorithm: 'HS256', expiresIn: constant.EXP })
  })
});

router.post('/register', validate.checkRegisterUsername, function(req, res, next) {
  mysqlquery('insert into user(username, password) values(?, ?)', [req.body.username, req.body.password.toLowerCase()]).then(() => {
    res.json({ 
      code: constant.CODE_SUCCESS
    })
  }).catch(err => {
    console.error(err);
      return next(err);
  })
});

router.get('/info', function(req, res, next) {
  mysqlquery('select username, role, avatar, signature, birth_date, job, address, phone, email from user left outer join user_detail on user.id = user_detail.user_id where id = ?', [req.user.userid]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS,
      data: {
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

async function createNewUserDetail(req, res, next) {
  try {
    let rows = await mysqlquery('select count(*) as mycount from user_detail where user_id=?', [req.user.userid]);
    if (rows[0].mycount === 0) {
      await mysqlquery('insert into user_detail(user_id) values(?)', [req.user.userid]);
      next();
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

router.post('/info', validate.checkEditInfoUsername, createNewUserDetail, async function(req, res, next) {
  try {
    await mysqlquery('update user set username=? where id=?', [req.body.username, req.user.userid]);
    await mysqlquery('update user_detail set signature=?, birth_date=?, job=?, address=?, phone=?, email=? where user_id=?', 
      [req.body.signature, req.body.birth_date, req.body.job, req.body.address, req.body.phone, req.body.email, req.user.userid]);
  } catch (err) {
    console.error(err)
    return next(err);
  }
})

router.post('/logout', function(req, res) {
  res.json({
    code: constant.CODE_SUCCESS
  })
})

router.post('/avatar', upload.any(), createNewUserDetail, function(req, res, next){
  if (req.files.length === 0) {
    res.status(400).send('no file')
  } else {
    let avatarPath = path.join('/', req.user.userid.toString(), req.files[0].filename)
    mysqlquery('update user_detail set avatar=? where user_id=?', [avatarPath, req.user.userid]).then(results => {
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
