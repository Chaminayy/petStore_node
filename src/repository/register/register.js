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
    } else {
      let result = {
        code: 200,
        message: '注册成功'
      }
      res.send(result)
    }
  })
}
