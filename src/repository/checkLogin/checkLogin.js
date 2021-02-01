const jwt = require('jsonwebtoken');

checkLogin = function (req, res, db) {
  let user = req.body.params;
  let result = {
    code: 200,
    message: '登录成功'
  };
  db.query(`SELECT * FROM ${globalThis.userInfoTable} WHERE phone_number = ${req.body.params.phoneNumber}`, (err, data) => {
    if (err) {
      result.code = 500;
      result.message = '服务异常';
      result.err = err;
      res.send(result);
      db.end()
    } else {
      if (data.length !== 0) {
        const queryData = data;
        if (user.phoneNumber === data[0]['phone_number'] && user.token === data[0]['token']) {
          let secretOrPrivateKey = 'jiami';
          jwt.verify(user.token, secretOrPrivateKey, (err, data) => {
            if (err) {
              result.code = 500; // 登录失效
              result.message = '登录失效';
              result.err = err;
              res.send(result);
              db.end()
            } else {
              result.user = {
                userName: queryData[0]['username'],
                userPhone: queryData[0]['phone_number']
              };
              res.send(result);
              db.end()
            }
          })
        }
      } else {
        result.code = 500;
        result.message = '服务异常';
        res.send(result);
        db.end()
      }
    }
  })
}
module.exports.checkLogin = checkLogin