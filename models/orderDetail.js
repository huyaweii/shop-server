const db = require('../utils/db')
const orderDetail = {
  add: async values => {
    let sql = `insert into order_detail set ?`
    return await db.asyncQuery(sql, [values])
  },
}
module.exports = orderDetail