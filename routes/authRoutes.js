const passport = require('passport')
const axios = require('axios')
const circularJSON = require('circular-json')

module.exports = app => {
    
    app.get('/auth/example', passport.authenticate('oauth2'))
    
    app.get(
        '/auth/example/callback', 
        passport.authenticate('oauth2', { session: false, failureRedirect: '/login' }),
        // (req, res) => res.send({ helpscoutHeader: req.user })
        (req, res) => res.redirect('/surveys')
    )
    
    app.get('/login', (req, res) => res.send( 'Login Failed'))
}