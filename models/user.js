const db = require('../utils/db')
const user = {
  add: async (values) => {
    let sql = 'insert into user set ?'
    return await db.asyncQuery(sql, [values])
  },
  update: async (openid, values) => {
    let sql = 'update user set ? where open_id = ?'
    return await db.asyncQuery(sql, [values, openid])
  },
  findOne: async openid => {
    let sql = `select * from user where open_id = ?`
    const res = await db.asyncQuery(sql, [openid])
    if (res.length > 0) {
      return res[0]
    }
    return null
  }
}
module.exports = user