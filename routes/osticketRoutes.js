const helpscout = require('../services/helpscout')
let hs = new helpscout()

module.exports = app => {

  //Check DB Connection
  app.get('/osticket/conn', function (req, res) {
    hs.mysqlTestConnection(function (cb) {
      res.send(cb)
      hs.mysqlClose()
    })
  })

  app.post('/osticket/importTickets', function (req, res) {
    // console.log(req.body)
    hs.threads = req.body
    hs.insertTickets(function (cb) {
      res.send(cb)
    })
  })
}