const path = require('path')
const fs = require('fs')

module.exports = function (app) {
  app.use('/sprites', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', 'sprites', req.url)
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'image/png')
      fs.createReadStream(filePath).pipe(res)
    } else {
      next()
    }
  })
}
