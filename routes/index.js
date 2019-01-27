var express = require('express');
var router = express.Router();
const axios = require('axios')
var app = express();
var jwt = require('jwt-simple')
var qiniu = require("qiniu")
var {db, jwtKey} = require('../config')
const log = require('../config/log')
const moment = require('moment')
const userModel= require('../models/user')
moment.locale('zh-cn')
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/uploadToken', async function(req, res, next) {
  const ak = 'xZxQTiyq-gMh-bTC-Ea4I4ps0bfWJR2Q5_ijaxh_'
  const sk = 'NbeJPPcmUg74uVNPVCKcOr831Lti-_MQ1tnRl_y2'
  const mac = new qiniu.auth.digest.Mac(ak, sk)
  const options = {
    scope: 'circle',
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  res.json({ uploadToken, status: 1 })
})
module.exports = router;
