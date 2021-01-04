const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let db
function handleError () {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  })
  
  //连接错误，2秒重试
  db.connect(function (err) {
    if (err) {
      setTimeout(handleError , 2000);
    }
  });
  
  db.on('error', function (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleError();
    } else {
      throw err;
    }
  });
}

handleError();

app.all('*', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
});

app.post('/', (req, res, next) => {
  db.query(`SELECT * FROM user_info WHERE phone_number = ${req.body.params.phoneNumber}`, (err, data) => {
    if (err) {
      console.log('数据库访问出错', err)
    } else {
      let result = {
        code: 200,
        message: '登录成功'
      }
      if (data.length === 0) {
        result.code = 404
        result.message = '账号不存在'
        res.send(result)
      } else {
        let user = req.body.params
        if (+user.phoneNumber === data[0]['phone_number'] && user.password === data[0]['password']) {
          let content = {phone: user.phoneNumber}
          let secretOrPrivateKey = 'jiami'
          let token = jwt.sign(content, secretOrPrivateKey, {
            expiresIn: 60*60*1
          })
          data[0].token = token
          result.user = {
            userName: data[0]['username'],
            userPhone: data[0]['phone_number'],
            token: token
          }
          db.query(`UPDATE user_info SET token = '${token}' WHERE phone_number = ${req.body.params.phoneNumber}`)
          res.send(result)
        } else {
          result.code = 401
          result.message = '账号或密码错误'
          res.send(result)
        }
      }
    }
  })
})

app.listen(3000, () => {
  console.log('server is running in post 3000')
})