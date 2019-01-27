const express = require('express');
const router = express.Router();
const moment = require('moment')
const jwt = require('jwt-simple')
const {jwtKey} = require('../config')
const db = require('../utils/db')
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const productPicInfoModel = require('../models/productPicInfo')
// 购物车添加
router.post('/:id/add', async function (req, res, next) {
  let {user_id} = jwt.decode(req.headers.token, jwtKey)
  let cartCount = 0
  const {productId, amount} = req.body
  const creatTime = moment().format('YYYY-MM-DD HH:mm:ss')
  try {
    let result = await cartModel.getList(user_id, productId)
    if (result.length === 0) {
      await cartModel.add({
        user_id, 
        product_id: productId, 
        product_amount: amount,
        create_time: creatTime
      })
      result = await cartModel.getList(user_id)
      if (result.length > 0) {
        for (const productInCart of result) {
          cartCount += productInCart.product_amount
        }
      }
      res.json({status: 1, data: {cartCount}})
    } else {
      const productInCart = result[0]
      await cartModel.updateCart(productInCart.id, {product_amount: productInCart.product_amount + amount})
      result = await cartModel.getList(user_id)
      if (result.length > 0) {
        for (const productInCart of result) {
          cartCount += productInCart.product_amount
        }
      }
      res.json({status: 1, data: {cartCount}})
    }
    
  } catch (err) {
    log.e(err)
    res.json({message: '添加失败', status: 0})
    throw err
  }
})

// 购物车删除商品
router.post('/:id/delete', async function (req, res, next) {
  let {user_id} = jwt.decode(req.headers.token, jwtKey)
  const {productId, amount} = req.body
  const creatTime = moment().format('YYYY-MM-DD HH:mm:ss')
  try {
    const result = await cartModel.getList(user_id, productId)
    if (result.length > 0) {
      const productInCart = result[0]
      if (productInCart.product_amount > 1) {
        await cartModel.updateCart(productInCart.id, {product_amount: productInCart.product_amount - amount})
      } else {
        await cartModel.delete(productInCart.id)
      }
      res.json({status: 1})
    } else {
      res.json({message: '商品已不存在', status: 0})
    }
  } catch (err) {
    log.e(err)
    res.json({message: '添加失败', status: 0})
    throw err
  }
})

router.get('/list', async function (req, res, next) {
  let {idList} = req.query
  let {user_id} = jwt.decode(req.headers.token, jwtKey)
  let sql, list = []
  if (idList) {
    list = await cartModel.getListByIdList(user_id, idList)
  } else {
    list = await cartModel.getList(user_id)
  }
  try {
    for (const productInCart of list) {
      const product = await productModel.getProduct(productInCart.product_id)
      if (product) {
        productInCart.product_price = product.price
        productInCart.product_name = product.name
      }
      const masterPic = await productPicInfoModel.getMasterPic(productInCart.product_id)
      productInCart.masterPic = masterPic ? masterPic.url : ''
    }
    res.json({status: 1, data: {list}})
  } catch (err) {
    log.e(err)
    res.json({message: '获取列表失败', status: 0})
    throw err
  }
})

module.exports = router;