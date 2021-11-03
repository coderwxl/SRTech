var express = require('express');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var constant = require('../utils/constant')

var router = module.exports = express.Router();

//获取聊天列表
router.get('/list', function(req, res, next) { 
    mysql.query('select 
                [req.user.userid]).then((results) => {
      res.json({
        code: constant.CODE_SUCCESS,
        data: results
      })
    }).catch(err => {
      console.error(err)
      return next(err);
    })
  });

  //获取聊天详情
  router.get('/list/:chatID(\\d+)', function(req, res, next) { 
    mysql.query('select chat_id, update_time, message.id as message_id, message.  from user_chat left join message on message.chat_id=user_chat.chat_id , ', 
                [req.user.userid, req.params.friendID]).then((results) => {
      res.json({
        code: constant.CODE_SUCCESS,
        data: results[0]
      })
    }).catch(err => {
      console.error(err)
      return next(err);
    })
  });