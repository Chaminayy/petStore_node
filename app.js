const express = require('express')
const app = express()
const mysql = require('mysql')
app.get('/', (req, res, next) => {
  res.send('hahhahah')
})

app.listen(3000, () => {
  console.log('server is running in post 3000')
})