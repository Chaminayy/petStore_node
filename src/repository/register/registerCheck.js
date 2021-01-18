module.exports.registerCheck = function (req, res, db) {
  db.query(`SELECT * FROM ${globalThis.userInfoTable} WHERE phone_number = '${req.body.params.phoneNumber}'`, (err, data) => {
    if (err) {
      console.log(err)
      let result = {
        code: 400,
        message: '服务异常'
      }
      res.send(result)
      db.end()
    } else {
      if (typeof(data.length) === "undefined" || data.length!== 0) {
        let result = {
          code: 500,
          message: '账号已存在'
        }
        res.send(result)
        db.end()
      } else {
        res.send({code: 200})
        db.end()
      }
    }
  })
}