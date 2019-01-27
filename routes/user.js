const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple')
const {db, jwtKey} = require('../config')
const axios = require('axios')
const userModel= require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', async function (req, res, next) {
  try {
    const result = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx3683e9d056495ca8&secret=37e30f36192a20b4c88920325122e43f&js_code=${req.query.code}&grant_type=authorization_code`)
    const {openid} = result.data
    const {avatar, name, gender} = req.query
    const user = await userModel.findOne(openid)
    if (user) {
      const token = jwt.encode(
        {
          openid,
          user_id: user.id
        },
        jwtKey
      )
      res.json({data: {token, user_id: user.id}, status: 1})  
    } else {
      sql = `insert into user (open_id) values (?)`
      const res = await new Promise(function (resolve, reject) {
        db.query(sql, [openid], function(err, result) {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
      await userModel.add({open_id: openid})
      const token = jwt.encode(
        {
          openid,
          user_id: res.insertId
        },
        jwtKey
      )
      res.json({data: {token, user_id: res.insertId}, status: 1})  
    }
  } catch (err) {
    log.e(err)
    res.json({message: '登录失败',status: 0})
    throw err
  }
})

router.post('/update', async function (req, res, next) {
  let openid = jwt.decode(req.headers.token, jwtKey).openid
  const {avatar, name, gender} = req.body
  try {
    await userModel.update(openid, {avatar, name, gender})
    res.json({status: 1})  
  } catch (err) {
    res.json({status: 0})
    throw err
  }
})


// router.get('/sync_userInfo', async function (req, res, next) {
//   try {
//     let openid = jwt.decode(req.headers.token, jwtKey).openid
//     let {avatar, name, gender, communityCode} = req.query
//     const communityCodeLen = 12
//     communityCode = communityCode * Math.pow(10, 12 - communityCode.length)
//     const sql = `select * from user where open_id = ?`
//     db.query(sql, [openid], async function(err, queryRes) {
//       if (queryRes.length === 0) {
//         const insertSql = `insert into user (open_id, avatar, name, gender, community_code) values (?, ?, ?, ?, ?)`
//         db.query(insertSql, [openid, avatar, name, gender, communityCode], function(err, addResult) {
//           res.json({status: 1})
//         })
//       } else {
//         let sql = 'select * from user where open_id=?'
//         const user = await new Promise(function (resolve, reject) {
//           db.query(sql, [openid], function(err, result) {
//             resolve(result)
//           })
//         })
//         const userCommCode = user[0].communityCode
//         sql = 'select * from area_code_2010 from code = ?'

//         const communityInfo = await new Promise(function (resolve, reject) {
//           db.query(sql, [userCommCode], function(err, result) {
//             resolve(result)
//           })
//         })
//         const userCommName = communityInfo[0].name

//         const updateSql = `update user set avatar=?, name=?, gender=? where open_id=?`
//         db.query(updateSql, [avatar, name, Number(gender), openid], function(err, updateResult) {
//           res.json({status: 1, couserCommName, userCommCode})
//         })
//         // db.query(updateSql, [avatar, name, Number(gender), openid], function(err, updateResult) {
//         //   res.json({status: 1})
//         // })
//       }
//     })
//   } catch (err) {
//     log.e(err)
//     res.send(err)
//     throw err
//   }
// })

module.exports = router;
