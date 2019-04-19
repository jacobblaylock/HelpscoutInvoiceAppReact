const express = require('express')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')
const keys = {
    helpscoutClientID: '94080494c1464f2c8f9b9d39adfacce2',
    helpscoutClientSecret: '264424344f514ea8be89e1cca7353076'
}

const app = express()

passport.use(new OAuth2Strategy({
        authorizationURL: 'https://secure.helpscout.net/authentication/authorizeClientApplication',
        tokenURL: 'https://api.helpscout.net/v2/oauth2/token',
        callbackURL: "/auth/example/callback"
    },
    accessToken => {
        console.log(accessToken)
    }
))

app.get('/', (req, res) => res.send({hi: 'testing OAuth2 with Helpscout ... Good Luck!'}))

app.get('/auth/example', passport.authenticate('oauth2', {
    clientID: keys.helpscoutClientID,
    clientSecret: keys.helpscoutClientSecret,
}))

app.get('/auth/example/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
      console.log(res)
    // Successful authentication, redirect home.
    res.redirect('/');
  })

const PORT = process.env.PORT || 5000
app.listen(PORT)