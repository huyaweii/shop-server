var mysql = require('mysql')
exports.db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shop'
})
exports.jwtKey = 'community-hyw'