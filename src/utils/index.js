const fs = require('fs')
module.exports = {
  getImage (req, res, db) {
    fs.readFile(req.query.src, (err, data) => {
      if (err) {
        console.log(err)
        res.send(err)
        db.end()
      } else {
        let result = {
          code: 200,
          data: data
        }
        res.send(result)
        db.end()
      }
    })
  }
}