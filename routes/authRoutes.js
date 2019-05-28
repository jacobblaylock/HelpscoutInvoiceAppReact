const passport = require('passport')
const promisify = require('util').promisify
const fs = require("fs")

module.exports = app => {

    app.get('/auth/example', passport.authenticate('oauth2'))

    app.get(
        '/auth/example/callback',
        passport.authenticate('oauth2', { session: false, failureRedirect: '/login' }),
        (req, res) => {
            promisify(fs.writeFile)('./temp/helpscoutConfig.json', JSON.stringify(req.user))
                .then(data => res.redirect('/main'))
        }
    )

    app.get('/login', (req, res) => res.send('Login Failed'))
}