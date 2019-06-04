const helpscout = require('../services/helpscout')
let hs = new helpscout()

module.exports = app => {

  //Check DB Connection
  app.get('/osticket/conn', function (req, res, next) {
    console.log(hs)
    hs.mysqlTestConnection(function (cb) {
      res.send(cb);
      //hs.mysqlClose();
    });
  })
}