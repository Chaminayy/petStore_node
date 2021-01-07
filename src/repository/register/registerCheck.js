module.exports.registerCheck = function (req, res, db) {
  db.query(`SELECT * FROM user_info WHERE phone_number = ${req.body.params.phoneNumber}`, (err, data) => {
    if (typeof(data.length) === "undefined" || data.length!== 0) {
      let result = {
        code: 500,
        message: '账号已存在'
      }
      res.send(result)
    } else {
      res.send({code: 200})
    }
  })
}