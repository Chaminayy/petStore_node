module.exports.forget = function (req, res, db) {
  db.query(`UPDATE ${globalThis.userInfoTable} SET password = '${req.body.params.password}' WHERE phone_number = ${req.body.params.phoneNumber}`, (err, data) => {
    let result = {
      code: 200,
      message: '密码重置成功'
    }
    if (err) {
      console.log(err)
      result.code = 500
      result.message = '服务异常'
      res.send(result)
      db.end()
    } else {
      res.send(result)
      db.end()
    }
  })
}