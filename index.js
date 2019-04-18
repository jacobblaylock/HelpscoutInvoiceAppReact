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
        clientID: keys.helpscoutClientID,
        clientSecret: keys.helpscoutClientSecret,
        callbackURL: "/auth/callback"
    }),
    accessToken => {
        console.log(accessToken)
    }
)

app.get('/auth', passport.authenticate('oauth2'))

const PORT = process.env.PORT || 5000
app.listen(PORT)