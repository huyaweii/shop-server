const db = require('../utils/db')
const productPic = {
  getMasterPic: async (id) => {
    let sql = `select * from product_pic_info where product_id = ? and is_master = 1`
    const res = await db.asyncQuery(sql, [id])
    if (res.length > 0) {
      return res[0]
    }
    return null
  }
}
module.exports = productPic