const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const connect = require('./src/dbConnect/index').handleError

globalThis.userInfoTable = 'user_info'

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
  const login = require("./src/repository/login/login").login;
  login(req, res, db)
})
app.post('/api/loginCheck', (req, res, next) => {
  const checkLogin = require('./src/repository/checkLogin/checkLogin').checkLogin
  checkLogin(req, res, db)
})

app.post('/api/registerCheck', (req, res, next) => {
  const checkRegister = require('./src/repository/register/registerCheck').registerCheck
  checkRegister(req, res, db)
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
  }
})

app.listen(3000, () => {
  console.log('server is running in post 3000')
})
