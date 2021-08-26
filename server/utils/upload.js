var multer = require('multer');
var path = require('path')
var fs = require('fs')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dst = path.join(__dirname, '..', 'userdata', req.user.userid.toString())
    if (!fs.existsSync(dst))
    {
      fs.mkdirSync(dst, { recursive: true })
    }
    cb(null, dst)
  },
  filename: function (req, file, cb) {
    let cur = new Date();
    cb(null, cur.getTime() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })

module.exports = upload