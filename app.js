const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const app = express()

const connect = require('./src/dbConnect/index').handleError
const login = require("./src/repository/login/login").login;
const checkLogin = require('./src/repository/checkLogin/checkLogin').checkLogin
const register = require('./src/repository/register/register').register
const sendMail = require('./src/repository/register/sendMail').sendMail
const checkRegister = require('./src/repository/register/registerCheck').registerCheck

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const db = connect();

app.all('*', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
});

app.post('/api/login', (req, res, next) => {
  login(req, res, db)
})
app.post('/api/loginCheck', (req, res, next) => {
  checkLogin(req, res, db)
})

app.post('/api/registerCheck', (req, res, next) => {
  checkRegister(req, res, db)
})

let time = null // 全局存储时间戳
let code = null // 全局存储验证码

app.post('/api/sendMail', (req, res, next) => {
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
        message: '验证码发送成功'
      }
      res.send(result)
    }
  })
})

app.post('/api/register', (req, res, next) => {
  let registerInfo = req.body.params
  let ctime = new Date().getTime()
  console.log(ctime - time)
  if (ctime - time >= 30 * 60 * 1000) {
    let result = {
      code: 600,
      message: '验证码过期'
    }
    res.send(result)
  } else {
    if (code === +registerInfo.code) {
      register(req, res, db)
    } else {
      let result = {
        code: 400,
        message: '验证码错误'
      }
      res.send(result)
    }
  }
})

app.listen(3000, () => {
  console.log('server is running in post 3000')
})
