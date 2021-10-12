var express = require('express');
var mysql = require('../utils/mysql-common')
var validate = require('../utils/validate')
var constant = require('../utils/constant')

var router = module.exports = express.Router();

//获取朋友列表
router.get('/', function(req, res, next) { 
  mysql.query('select user.id, user.username, user_detail.avatar, user_detail.signature from user, user_detail, friend \
              where user.id = user_detail.user_id and user.id=friend.friend_id and friend.user_id = ? and friend.is_blacklist = 0 order by user.username', 
              [req.user.userid]).then((results) => {
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

//获取朋友详情
//todo 一方删除的情况处理
router.get('/:friendID(\\d+)', function(req, res, next) { 
  mysql.query('select user.username, user_detail.avatar, user_detail.signature, user_detail.birth_date, user_detail.job, user_detail.address, user_detail.phone, \
              user_detail.email, friend.add_time, friend.remark from user, user_detail, \
              friend where user.id = user_detail.user_id and user.id=friend.friend_id and friend.user_id = ? and friend.friend_id = ? and friend.is_blacklist = 0 order by user.username', 
              [req.user.userid, req.params.friendID]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS,
      data: results
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});

/*******************************************************
input:
{
  "friendName":"wxl"
}
output:
{
  "code": 0
}
*******************************************************/
//添加朋友
//todo 推送新朋友添加申请；处理status
router.post('/',  validate.checkAddFriendName, function(req, res, next) { 
  mysql.pool.getConnection(async(err, connection) => {
    if (err) return next(err);
    try {
      await mysql.pool.connectionBeginTransaction(connection);

      try {
        await mysql.connectionQuery(connection, 'insert into friend(user_id, friend_id) values(?, ?, ?)', [req.user.userid, res.locals.friendID]);
        await mysql.connectionQuery(connection, 'insert into friend(user_id, friend_id) values(?, ?, ?)', [res.locals.friendID, req.user.userid]);
        
        await mysql.pool.connectionCommit(connection);
        connection.release();

        res.json({
          code: constant.CODE_SUCCESS
        })
      } catch (e) {
        await mysql.pool.connectionRollback(connection);
        connection.release();
        return next(err);
      }

    } catch (e) {
      return next(err);
    }
  })
});

//删除朋友
router.delete('/:friendID(\\d+)', function(req, res, next) { 
  mysql.query('delete from friend where user_id = ? and friend_id = ?', [req.user.userid, req.params.friendID]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});

/*******************************************************
input:
{
  "remark":"wxl"
}
output:
{
  "code": 0
}
*******************************************************/
//修改备注
router.put('/remark/:friendID(\\d+)', function(req, res, next) { 
  mysql.query('update friend set remark = ? where user_id = ? and friend_id = ?', [req.body.remark, req.user.userid, req.params.friendID]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});

/*******************************************************
input:
{
  "isBlacklist": 0 //0：从黑名单移除，1：加入黑名单
}
output:
{
  "code": 0
}
*******************************************************/
//黑名单
router.put('/blacklist/:friendID(\\d+)', function(req, res, next) { 
  mysql.query('update friend set is_blacklist = ? where user_id = ? and friend_id = ?', [req.body.isBlacklist, req.user.userid, req.params.friendID]).then((results) => {
    res.json({
      code: constant.CODE_SUCCESS
    })
  }).catch(err => {
    console.error(err)
    return next(err);
  })
});
