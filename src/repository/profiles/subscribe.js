module.exports.subscribe = function (req, res, db) {
  const userData = req.body.params;
  const sql1 = `UPDATE ${globalThis.profiles} SET order_phone = '${userData.phoneNumber}', order_name = '${userData.userName}', order_email = '${userData.email}', order_state = '${userData.state}', order_remark = '${userData.remark}', order_time = '${userData.orderTime}' WHERE phone_number = '${userData.userId}'`;
  const sql2 = `UPDATE ${globalThis.profiles} SET order_state = '${userData.state}' WHERE phone_number = '${userData.userId}'`;
  db.query(+userData.state === 1 ? sql1 : sql2, (err, data) => {
    const result = {
      code: 200,
      msg: +userData.state === 1 ? '预约成功' : '取消预约成功'
    };
    if (err) {
      console.log(err);
      result.code = 500;
      result.msg = +userData.state === 1 ? '预约失败：服务异常' : '取消预约失败：服务异常';
      res.send(result);
      db.end();
    } else {
      res.send(result);
      db.end();
    }
  })
};
