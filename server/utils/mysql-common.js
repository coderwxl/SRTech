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

module.exports = query