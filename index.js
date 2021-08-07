var cookieParser = require('cookie-parser')
var express = require('express')
const path = require('path')
const cors = require('cors')
var app = express()

// app.set('trust proxy', 1) // trust first proxy

app.use(cookieParser('my secret wxl'))

const corsConfig = {
  origin: true,
  methods: ["GET","POST"],
  credentials: true,
  maxAge: 60
};

app.use(cors(corsConfig));

app.get('/', function (req, res) {
  // console.log(req.cookies)
  console.log(req.signedCookies)

  res.cookie('msg', 'wangxiaolong', {signed: true, maxAge: 3*1000})
  res.sendFile(path.join(__dirname + '/index2.html'))
})

app.get('/user', (req, res) => {
  console.log(req.url)
  console.log(req.path)
  // res.jsonp(['abc', '123'])
  // res.redirect('https://www.baidu.com')
  res.send('aaa')
})

app.listen(3000, () => {
  console.log('listen on 3000')
})