const express = require('express');
const router = express.Router();
const {db, jwtKey} = require('../config')
const jwt = require('jwt-simple')
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const productPicInfoModel = require('../models/productPicInfo')
// 创建商品
router.post('/create', async function (req, res, next) {
  try {
    let sql = `insert into good (name, unit, desc, price) values (?, ?, ?, ?)`
    const {name, unit, desc, price} = req.body
    const post = await new Promise((resolve, reject) => {
      db.query(sql, [name, unit, desc, price], function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
    res.json({status: 1})
  } catch (err) {
    log.e(err)
    res.json({message: '发布失败', status: 0})
    throw err
  }
})

// 商品列表
router.get('/list', async function (req, res, next) {
  const {category} = req.query
  const condition = {
    category: +category
  }
  try {
    const list = await productModel.find(condition)
    for (const product of list) {
      const pic = await productPicInfoModel.getMasterPic(product.id)
      product.masterPic = pic ? pic.url : ''
    }
    res.json({status: 1, data: {list}})
  } catch (err) {
    log.e(err)
    res.json({message: '发布失败', status: 0})
    throw err
  }
})

// 产品详情
router.get('/:id', async function (req, res, next) {
  let {user_id} = jwt.decode(req.headers.token, jwtKey)
  const {id} = req.params
  let sql, result, cartCount = 0
  try {
    const product = await productModel.getProduct(id)
    let productDetail = product || {}
    const pic = await productPicInfoModel.getMasterPic(id)
    productDetail.masterPic = pic ? pic.url : ''
    const result = await cartModel.getList(user_id)
    if (result.length > 0) {
      for (const productInCart of result) {
        cartCount += productInCart.product_amount
      }
    }
    productDetail.cartCount = cartCount
    res.json({status: 1, data: {productDetail}})
  } catch (err) {
    log.e(err)
    res.json({message: '发布失败', status: 0})
    throw err
  }
})
module.exports = router;