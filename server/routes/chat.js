var express = require('express');
var path = require('path');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var constant = require('../utils/constant')
var socket = require('../utils/socket')
var upload = require('../utils/upload')

var router = module.exports = express.Router();

//获取聊天列表
router.get('/list', function(req, res, next) { 
    mysql.query('select user_chat.chat_id, user_chat.time, user.avatar as friend_avatar, user.username as friend_name, user.id as friend_id from user_chat, user where user_chat.friend_id=user.id and user_chat.type=1 and user_id = ? order by user_chat.time desc', [req.user.userid])
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
    let rst = await mysql.query('select count(*) as mycnt from user_chat where user_id = ? and chat_id = ?', [req.body.friendID, req.body.chatID]);
    if (rst[0].mycnt === 0) {
      await mysql.query('insert into user_chat(user_id, chat_id, friend_id) values(?, ?, ?)', [req.body.friendID, req.body.chatID, req.user.userid])
    }
    socket.sendMessage([req.body.friendID, req.user.userid], "newMessage", {
      [req.body.chatID.toString()]: req.body.message
    });
    res.json({
      code: constant.CODE_SUCCESS
    })
  } catch (err) {
    return next(err);
  }
})

router.post('/sendfile', upload.any(), async function(req, res, next){
  if (req.files.length === 0) {
    res.status(400).send('no file')
  } else {
    // console.log(req.files)
    let style = "text-decoration:underline; color:blue;"
    let str = `<a href="${path.join('/', req.user.userid.toString(), req.files[0].filename)}" download="${req.files[0].originalname}" style="${style}">${req.files[0].originalname}</a>`
    try {
      await mysql.query('insert into message(chat_id, user_id, data) values(?, ?, ?)', [req.body.chatID, req.user.userid, str]);
      let rst = await mysql.query('select count(*) as mycnt from user_chat where user_id = ? and chat_id = ?', [req.body.friendID, req.body.chatID]);
      if (rst[0].mycnt === 0) {
        await mysql.query('insert into user_chat(user_id, chat_id, friend_id) values(?, ?, ?)', [req.body.friendID, req.body.chatID, req.user.userid])
      }
      res.json({
        code: constant.CODE_SUCCESS
      })
      socket.sendMessage([req.body.friendID, req.user.userid], "newMessage", {
        [req.body.chatID.toString()]: str
      });
    } catch (err) {
      return next(err);
    }
  }
})