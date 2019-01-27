const express = require('express');
const router = express.Router();
const moment = require('moment')
const jwt = require('jwt-simple')
const {jwtKey} = require('../config')
const db = require('../utils/db')
const cartModel = require('../models/cart')
const orderModel = require('../models/order')
const orderDetailModel = require('../models/orderDetail')
const productModel = require('../models/product')
const productPicInfoModel = require('../models/productPicInfo')
// 创建订单
router.post('/create', async function (req, res, next) {
  try {
    let {user_id} = jwt.decode(req.headers.token, jwtKey)
    const {idList} = req.body
    let cartResult = await cartModel.getListByIdList(user_id, idList)
    for (const productInCart of cartResult) {
      const product = await productModel.getProduct(productInCart.product_id)
      productInCart.product_name = product.name
      productInCart.product_price = product.price
    }
    let values = {
      user_id, 
      order_number: moment().format('YYYYMMDDHHmmssSSS'),
      address: '胜芳镇',
      create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let orderResult = await orderModel.add(values)
    for (const product of cartResult) {
      const {product_id, product_name, product_price, product_amount} = product
      const product_pic = await productPicInfoModel.getMasterPic(product_id)
      values = {
        order_id: orderResult.insertId,
        product_id,
        product_name,
        product_price,
        product_amount,
        product_pic: product_pic.url
      }
      const productDetail = await productModel.findOne(product_id)
      await orderDetailModel.add(values)
      await productModel.update(product_id, {amount: productDetail.amount - product_amount})
    }
    await cartModel.batchDelete(idList)
    res.json({status: 1})
  } catch (err) {
    throw err
  }
})

// 获取我的订单
router.get('/mine/list', async function (req, res, next) {
  const {status} = req.query
  try {
    let {user_id} = jwt.decode(req.headers.token, jwtKey)
    let orders = await orderModel.getOrderList(user_id, status)
    for (const order of orders) {
      const products = await orderModel.getOrderDetail(order.id)
      order.products = products
    }
    res.json({status: 1, data: {orders}})
  } catch (err) {
    throw err
  }
})

// 订单详情
router.get('/:id/detail', async function (req, res, next) {
  const {id} = req.params
  let sql
  try {
    const order = await orderModel.getOrder(id)
    if (order) {
      order.products = await orderModel.getOrderDetail(id)
      res.json({status:1, data: {...order}})
    } else {
      res.json({status: 0})
    }
  } catch(err) {
    res.json({status: 0})
    throw err
  }
})

module.exports = router;