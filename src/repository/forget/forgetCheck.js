module.exports.forgetCheck = function (req, res, db, callback) {
  db.query(`SELECT * FROM ${globalThis.userInfoTable} WHERE phone_number = ${req.body.params.phoneNumber} and email = '${req.body.params.email}'`, (err, data) => {
    let result = {
      code: 500,
      message: '服务异常'
    }
    if (err) {
      console.log(err)
      res.send(result)
    } else {
      if (data.length > 0) {
        result.code = 200
        result.message = ''
        callback(req, res)
      } else {
        result.code = 300
        result.message = '账号与邮箱不匹配'
        res.send(result)
      }
    }
    
  })
}


