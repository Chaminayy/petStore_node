const fs = require('fs')
const formidable = require('formidable')
const path = require('path')

module.exports.avatar = function (req, res, db) {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../../../static'); //文件保存的临时目录为static文件夹（文件夹不存在会报错，一会接受的file中的path就是这个）
  form.maxFieldsSize = 1 * 1024 * 1024; //用户头像大小限制为最大1M
  form.keepExtensions = true; //使用文件的原扩展名
  form.parse(req, function (err, fields, file) {
    let filePath = '';
    if (file.tmpFile) {
      filePath = file.tmpFile.path;
    } else {
      for (let key in file) {
        if (file[key].path && filePath === '') {
          filePath = file[key].path;
          break;
        }
      }
    }
    //文件移动的目录文件夹，不存在时创建目标文件夹
    let targetDir = path.join(__dirname, '../../../../static/uploads');
    let fileExt = filePath.substring(filePath.lastIndexOf('.'));
    //判断文件类型是否允许上传
    if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
      let result = {
        code: -1,
        message: '此文件类型不允许上传'
      }
      res.send(result)
      db.end()
    } else {
      //以当前时间戳对上传文件进行重命名
      let fileName = new Date().getTime() + fileExt;
      let targetFile = path.join(targetDir, fileName);
      //移动文件
      fs.rename(filePath, targetFile, function (err) {
        if (err) {
          console.info(err);
          let result = {
            code: -1,
            message: '操作失败'
          };
          res.send(result)
          db.end()
        } else {
          db.query(`update ${globalThis.profiles} set head_name = '${fileName}' where phone_number = '${req.query.phoneNumber}'`, (err, data) => {
            if (err) {
              console.log(err)
              let result = {
                code: -1,
                message: '服务器异常'
              }
              res.send()
              db.end()
            } else {
              let result = {
                code: 200,
                message: '上传成功',
                path: '../static/uploads',
                headName: fileName
              }
              res.send(result)
              db.end()
            }
          })
        }
      });
    }
  });
}
