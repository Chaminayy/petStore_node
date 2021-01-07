const mysql = require('mysql')
handleError = function () {
  let db
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
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
      throw err;
    }
  });
  return db;
}

module.exports.handleError = handleError