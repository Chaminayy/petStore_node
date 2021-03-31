module.exports.collect = function (req, res, db) {
  db.query(`SELECT * FROM ${globalThis.profiles} WHERE phone_number = '${req.body.params.userId}'`, (err, data) => {
    const result = {
      code: 200,
      msg: '收藏成功'
    };
    if (err) {
      console.log(err);
      result.code = 500;
      result.msg = '服务异常';
      res.send(result);
      db.end();
    } else {
      let collect = '';
      if (+req.body.params.state === 0) {
        if (data[0].collect === null) {
          collect = req.body.params.id
        } else {
          const arr = data[0].collect.split(',');
          arr.push(req.body.params.id + '');
          collect = [...new Set(arr)].join();
        }
        db.query(`UPDATE ${globalThis.profiles} SET collect = '${collect}' WHERE phone_number = '${req.body.params.userId}'`, (err, data) => {
          if (err) {
            console.log(err);
            result.code = 500;
            result.msg = '收藏失败：服务异常';
            res.send(result);
            db.end();
          } else {
            res.send(result);
            db.end()
          }
        })
      }
    }
  })
};
