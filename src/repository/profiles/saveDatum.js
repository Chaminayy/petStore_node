module.exports.saveDatum = function (req, res, db) {
  db.query(`UPDATE ${globalThis.profiles} SET username = '${req.body.params.username}', mark = '${req.body.params.mark}', birthday = '${req.body.params.birthday}', occupation = '${req.body.params.occupation}', city='${req.body.params.city}' WHERE phone_number = '${req.body.params.phoneNumber}'`, (err, data) => {
    let result = {
      code: 200,
      message: '保存成功'
    }
    if (err) {
      console.log(err)
      result.code = 500
      result.message = '保存失败，服务器异常'
      res.send(result)
      db.end()
    } else {
      db.query(`UPDATE ${globalThis.userInfoTable} SET username = '${req.body.params.username}' WHERE phone_number = '${req.body.params.phoneNumber}'`, (err, data) => {
        if (err) {
          console.log(err)
          result.code = 500
          result.message = '保存失败，服务器异常'
          res.send(result)
          db.end()
        } else {
          result.user = {
            userName: req.body.params.username,
            userPhone: req.body.params.phoneNumber
          }
          res.send(result)
          db.end()
        }
      })
    }
  })
}