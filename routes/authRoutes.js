const passport = require('passport')
const promisify = require('util').promisify
const fs = require("fs")
const axios = require('axios')

module.exports = app => {

  app.get('/auth/helpscout', passport.authenticate('oauth2'))

  app.get(
    '/auth/helpscout/callback',
    passport.authenticate('oauth2', { session: false, failureRedirect: '/main' }),
    (req, res) => {
      // promisify(fs.writeFile)('./temp/helpscoutConfig.json', JSON.stringify(req.user))
      //     .then(data => res.redirect('/main'))
      axios.interceptors.request.use(function (config) {
        config.headers.Authorization = req.user.headers.Authorization
        config.baseURL = req.user.baseURL
        return config
      }, function (error) {
        // Do something with request error
        return Promise.reject(error)
      })
      res.redirect('/main')
    }
  )
}