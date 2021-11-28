var express = require('express');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var constant = require('../utils/constant')
var socket = require('../utils/socket')

var router = module.exports = express.Router();

//获取聊天列表
router.get('/list', function(req, res, next) { 
    console.log(req.user.userid)
    mysql.query('select user_chat.chat_id, user_chat.time, user.avatar as friend_avatar, user.username as friend_name from user_chat, user where user_chat.friend_id=user.id and user_chat.type=1 and user_id = ? order by user_chat.time desc', [req.user.userid])
      .then(async(results) => {
        for (let element of results) {
          chatMessage = await mysql.query('select data from message where chat_id = ? order by time desc limit 1', [element.chat_id]);
          if (chatMessage.length) {
            element.message = chatMessage[0].data;
          } else {
            element.message = '';
          }
        }
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
  mysql.query('select message.id, message.user_id, message.data, message.time, user.username, user.avatar  from message left join user on message.user_id = user.id where message.chat_id = ? order by message.time asc', 
              [req.params.chatID]).then((results) => {
    console.log(results);
    res.json({
      code: constant.CODE_SUCCESS,
      data: results
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});

router.post('/message', async function(req, res, next) {
  try {
    await mysql.query('insert into message(chat_id, user_id, data) values(?, ?, ?)', [req.body.chatID, req.user.userid, req.body.message]);
    let results = await mysql.query('select friend_id from user_chat where user_id = ? and chat_id = ?', [req.user.userid, req.body.chatID]);
    for (let obj of results) {
      socket.sendMessage(obj.friend_id, {
        [req.body.chatID]: req.body.message
      });
    }
    res.json({
      code: constant.CODE_SUCCESS
    })
  } catch (err) {
    return next(err);
  }
})