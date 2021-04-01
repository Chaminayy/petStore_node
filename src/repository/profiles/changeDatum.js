module.exports.changeDatum = function (req, res, db) {
  db.query(`SELECT * FROM ${globalThis.profiles} WHERE phone_number = '${req.query.phoneNumber}'`, (err, data) => {
    let result = {
      code: 200,
      profiles: {}
    }
    if (err) {
      console.log(err);
      result.code = 500;
      result.message = '服务器异常';
      res.send(result);
      db.end()
    } else {
      if (data.length === 0) {
        result.code = 400;
        result.message = '服务器异常';
        res.send(result);
        db.end()
      } else {
        result.profiles = data[0];
        res.send(result);
        db.end()
      }
    }
  })
};
