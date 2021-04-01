const mysql = require('mysql')
globalThis.userInfoTable = 'user_info'

handleError = function () {
  let db;
  db = mysql.createConnection({
    // 生产环境
    // host: '121.196.167.112',
    // database: 'pet_store',

    // 测试环境
    host: 'localhost',
    database: 'test',
    user: 'root',
    password: 'root',
  })
  //连接错误，2秒重试
  db.connect(function (err) {
    if (err) {
      setTimeout(handleError , 2000);
    }
  });

  db.on('error', function (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleError();
    } else {
      console.log(err)
      handleError()
    }
  });
  return db;
};
module.exports.handleError = handleError
