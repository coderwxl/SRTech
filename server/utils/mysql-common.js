var mysql = require('mysql')
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'srdb'
})

module.exports = pool