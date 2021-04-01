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
          if (arr[0] === '') {
            arr.splice(0,1)
          }
          collect = [...new Set(arr)].join();
        }
      }
      if (+req.body.params.state === 1) {
        // const arr = data[0].collect.split(',');
        const arr = data[0].collect.split(',').filter(o => o !== req.body.params.id + '');
        if (arr[0] === '') {
          arr.splice(0,1)
        }
        collect = [...new Set(arr)].join();
      }
      db.query(`UPDATE ${globalThis.profiles} SET collect = '${collect}' WHERE phone_number = '${req.body.params.userId}'`, (err, data) => {
        if (err) {
          console.log(err);
          result.code = 500;
          result.msg = +req.body.params.state === 0 ? '收藏失败：服务异常' : '取消收藏失败：服务异常';
          res.send(result);
          db.end();
        } else {
          result.msg = +req.body.params.state === 0 ? '收藏成功' : '取消收藏成功';
          res.send(result);
          db.end()
        }
      })
    }
  })
};
