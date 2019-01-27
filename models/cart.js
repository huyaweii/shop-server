const db = require('../utils/db')
const cart = {
  add: async values => {
    let sql = `insert into cart set ?`
    return await db.asyncQuery(sql, [values])
  },
  delete: async id => {
    let sql = 'delete from cart where id = ?'
    return await db.asyncQuery(sql, [id])
  },
  batchDelete: async ids => {
    let sql = `delete from cart where product_id in (${ids})`
    return await db.asyncQuery(sql, [])
  },
  getList: async (user_id, product_id) => {
    let sql = 'select * from cart where user_id = ?'
    let params = [user_id]
    if (product_id) {
      sql += ' and product_id = ?'
      params.push(product_id)
    }
    return await db.asyncQuery(sql, params)
  },
  getListByIdList: async (user_id, idList) => {
    let sql = `select * from cart where user_id = ? and product_id in (${idList})`
    return await db.asyncQuery(sql, [user_id])
  },
  updateCart: async (id, values) => {
    let sql = 'update cart set ? where id = ?'
    return await db.asyncQuery(sql, [values, id])
  }
}
module.exports = cart