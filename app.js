const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')


const utils = require('./src/utils/index')
const connect = require('./src/dbConnect/index').handleError

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

globalThis.userInfoTable = 'user_info'
globalThis.productImage = 'product_supplies'
globalThis.profiles = 'profiles'

let db = connect();

app.all('*', function(req, res, next) {
  db = connect()
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
});
app.listen(3000, () => {
  console.log('server is running in post 3000')
})

let time = null // 全局存储时间戳
let code = null // 全局存储验证码

function sendEMail (req, res, next) {
  const sendMail = require('./src/repository/register/sendMail').sendMail
  let email = req.body.params.email
  code = Math.floor(Math.random() * 1000000)
  time = new Date().getTime()
  sendMail(email, '验证码', code, (err, data) => {
    if (err) {
      console.log(err)
      let result = {
        code: 500,
        message: '验证码发送失败'
      }
      res.send(result)
    } else {
      let result = {
        code: 200,
        authCode: code,
        message: '验证码发送成功'
      }
      res.send(result)
    }
  })
}


app.post('/api/login', (req, res, next) => {
  const login = require("./src/repository/login/login").login;
  login(req, res, db)
})

app.post('/api/loginCheck', (req, res, next) => {
  const checkLogin = require('./src/repository/checkLogin/checkLogin').checkLogin
  if (req.body.params.phoneNumber !== null && req.body.params.phoneNumber !== 'null') {
    checkLogin(req, res, db)
  } else {
    let result = {
      code: 500,
      message: '请先登录'
    }
    res.send(result)
    db.end()
  }
})

app.post('/api/registerCheck', (req, res, next) => {
  const checkRegister = require('./src/repository/register/registerCheck').registerCheck
  checkRegister(req, res, db)
})

app.post('/api/sendMail', (req, res, next) => {
  sendEMail(req, res, next)
})

app.post('/api/forgetSendMail', (req, res, next) => {
  const checkForget = require('./src/repository/forget/forgetCheck').forgetCheck
  checkForget(req, res, db, sendEMail)
})

app.post('/api/register', (req, res, next) => {
  const register = require('./src/repository/register/register').register
  let registerInfo = req.body.params
  let ctime = new Date().getTime()
  if (ctime - time >= 30 * 60 * 1000) {
    let result = {
      code: 600,
      message: '验证码过期'
    }
    res.send(result)
    db.end()
  } else {
    if (code === +registerInfo.code) {
      register(req, res, db)
    } else {
      let result = {
        code: 400,
        message: '验证码错误'
      }
      res.send(result)
      db.end()
    }
  }
})

app.post('/api/forget', (req, res, next) => {
  const forget = require('./src/repository/forget/forget').forget
  if (+req.body.params.password === +req.body.params.newPassword) {
    forget(req, res, db)
  } else {
    let result = {
      code: 500,
      message: '两次密码不一致'
    }
    res.send(result)
    db.end()
  }
})

app.get('/product/getImas', (req, res, next) => {
  db.query(`SELECT * FROM ${globalThis.productImage}`, (err, data) => {
    let result = {
      code: 200,
    }
    if (err) {
      console.log(err)
      result.code = 500
      result.message = '服务器异常'
      res.send(result)
      db.end()
    } else {
      res.send(data)
      db.end()
    }
  })
})

app.get('/product/getIma', (req, res, next) => {
  utils.getImage(req, res ,db)
})

app.get('/profiles/changeDatum', (req, res, next) => {
  const changeDatum = require('./src/repository/profiles/changeDatum').changeDatum
  changeDatum(req, res, db)
})

app.post('/profiles/saveDatum', (req, res, next) => {
  const saveDatum = require('./src/repository/profiles/saveDatum').saveDatum
  saveDatum(req, res, db)
})

app.post('/profiles/changePassword', (req, res, next) => {
  const changePassword = require('./src/repository/profiles/changePassword').changePassword
  changePassword(req, res, db)
})


app.post('/profiles/avatar', (req, res, next) => {
  const avatar = require('./src/repository/profiles/avatar').avatar
  avatar(req, res, db)
})
