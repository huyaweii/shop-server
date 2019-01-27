const db = require('../utils/db')
const product = {
  update: async (id, values) => {
    let sql = 'update product set ? where id = ?'
    return await db.asyncQuery(sql, [values, id])
  },
  findOne: async (id) => {
    let sql = 'select * from product where id = ?'
    const res = await db.asyncQuery(sql, [id])
    if (res.length > 0) {
      return res[0]
    }
    return null
  },
  getProduct: async (id) => {
    let sql = 'select * from product where id = ?'
    const res = await db.asyncQuery(sql, [id])
    if (res.length > 0) {
      return res[0]
    }
    return null
  },
  getProductByCategory: async (category) => {
    let sql = 'select * from product where category = ?'
    return await db.asyncQuery(sql)
  },
  getProductList: async () => {
    let sql = 'select * from product'
    return await db.asyncQuery(sql)
  },
  find: async (condition) => {
    let sql = 'select * from product'
    const params = []
    if (condition && JSON.stringify(condition) !== '{}') {
      sql += ' where '
      for (name in condition) {
        sql += `${name} = ? and `
        params.push(condition[name])
      }
      sql = sql.substr(0, sql.length - 4)
    }
    return await db.asyncQuery(sql, params)
  }
}
module.exports = product