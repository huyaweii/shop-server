const db = require('../utils/db')
const order = {
  add: async values => {
    let sql = `insert into product_order set ?`
    return await db.asyncQuery(sql, [values])
  },
  getOrder: async (id) => {
    sql = `select * from product_order where id = ?`
    const res = await db.asyncQuery(sql, [id])
    if (res.length > 0) {
      return res[0]
    }
    return null
  },
  getOrderList: async (userId, status = '') => {
    const params = [userId]
    let sql = `select * from product_order where user_id = ?`
    if (status !== '') {
      sql += ' and order_status = ?'
      params.push(status)
    }
    return await db.asyncQuery(sql, params)
  },
  getOrderDetail: async (orderId) => {
    sql = `select * from order_detail where order_id = ?`
    return await db.asyncQuery(sql, [orderId])
  }
}
module.exports = order