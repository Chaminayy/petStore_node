module.exports.register = function (req, res ,db) {
  let registerInfo = req.body.params
  let sql = `INSERT INTO ${globalThis.userInfoTable} (phone_number, username, password, email) VALUES ('${registerInfo.phoneNumber}', '${registerInfo.username}', '${registerInfo.password}', '${registerInfo.email}')`
  db.query(sql, (err, data) => {
    if (err) {
      let result = {
        code: 500,
        message: '操作有误',
        err: err
      }
      res.send(result)
      db.end()
    } else {
      db.query(`INSERT INTO profiles (phone_number, username, email, head_path) VALUES ('${registerInfo.phoneNumber}', '${registerInfo.username}', '${registerInfo.email}', '../static/uploads')`, (err, data) => {
        if (err) {
          console.log(err)
          let result = {
            code: 400,
            message: '服务器异常',
            err: err
          }
        } else {
          let result = {
            code: 200,
            message: '注册成功'
          }
          res.send(result)
          db.end()
        }
      })
    }
  })
}

