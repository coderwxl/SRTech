var mysql = require('mysql')

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'srdb',
  dateStrings: true
})

var query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

var connectionQuery = function (connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

var connectionBeginTransaction = function (connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

var connectionCommit = function (connection) {
  return new Promise((resolve, reject) => {
    connection.commit(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

var connectionRollback = function (connection) {
  return new Promise((resolve, reject) => {
    connection.rollback(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

exports.query = query
exports.pool = pool
exports.connectionQuery = connectionQuery
exports.connectionBeginTransaction = connectionBeginTransaction
exports.connectionCommit = connectionCommit
exports.connectionRollback = connectionRollback