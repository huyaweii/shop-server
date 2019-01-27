const {db} = require('../config')
db.asyncQuery = async (sql, data = []) => {
  return await new Promise((resolve, reject) => {
    db.query(sql, data, function(err, result) {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
}
exports = module.exports = db