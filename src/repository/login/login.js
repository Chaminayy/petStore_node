const jwt = require('jsonwebtoken')
module.exports.login = function(req, res, db) {
  db.query(`SELECT * FROM ${globalThis.userInfoTable} WHERE phone_number = '${req.body.params.phoneNumber}'`, (err, data) => {
    if (err) {
      console.log(err)
      let result = {
        code: 500,
        message: '服务异常',
        err: err
      }
      res.send(result)
      db.end()
    } else {
      let result = {
        code: 200, // 登录成功
        message: '登录成功'
      }
      if (data.length === 0) {
        result.code = 404 // 账号不存在
        result.message = '账号不存在'
        res.send(result)
        db.end()
      } else {
        let user = req.body.params
        if (user.phoneNumber === data[0]['phone_number'] && user.password === data[0]['password']) {
          let content = {phone: user.phoneNumber}
          let secretOrPrivateKey = 'jiami'
          let token = jwt.sign(content, secretOrPrivateKey, {
            expiresIn: 60 * 60 * 60 * 1
          })
          data[0].token = token
          result.user = {
            userName: data[0]['username'],
            userPhone: data[0]['phone_number'],
            token: token
          }
          db.query(`UPDATE ${globalThis.userInfoTable} SET token = '${token}' WHERE phone_number = '${req.body.params.phoneNumber}'`)
          res.send(result)
          db.end()
        } else {
          result.code = 401 // 账号或密码错误
          result.message = '账号或密码错误'
          res.send(result)
          db.end()
        }
      }
    }
  })
}
