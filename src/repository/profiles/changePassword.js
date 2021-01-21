module.exports.changePassword = function (req, res, db) {
  let passwordObj = req.body.params
  let result = {
    code: 500,
    message: '服务异常'
  }
  if (passwordObj.password === '' || passwordObj.newPassword === '') {
    res.send(result)
    db.end()
  } else {
    db.query(`select * from ${globalThis.userInfoTable} where phone_number = '${passwordObj.phoneNumber}' and password = '${passwordObj.password}'`, (err, data) => {
      if (err) {
        console.log(err)
        res.send(result)
        db.end()
      } else {
        if (data.length === 0) {
          result.code = 400
          result.message = '原始密码错误'
          res.send(result)
          db.end()
        } else {
          db.query(`UPDATE ${globalThis.userInfoTable} SET password = '${passwordObj.newPassword}' where phone_number = '${passwordObj.phoneNumber}'`, (err, data) => {
            if (err) {
              console.log(err)
              res.send(result)
              db.end()
            } else {
              result.code = 200
              result.message = '密码更新完成'
              res.send(result)
              db.end()
            }
          })
        }
      }
    })
  }
}