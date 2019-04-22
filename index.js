const express = require('express')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')
const axios = require('axios')

const keys = {
    helpscoutClientID: '94080494c1464f2c8f9b9d39adfacce2',
    helpscoutClientSecret: '264424344f514ea8be89e1cca7353076'
}

const app = express()

var helpscoutConfig

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://secure.helpscout.net/authentication/authorizeClientApplication',
    tokenURL: 'https://api.helpscout.net/v2/oauth2/token',
    clientID: keys.helpscoutClientID,
    clientSecret: keys.helpscoutClientSecret,
    callbackURL: "https://mighty-journey-28056.herokuapp.com/auth/example/callback"
    // callbackURL: "http://127.0.0.1:5000/auth/example/callback"
},
    (accessToken, refreshToken, profile, done) => {
        helpscoutConfig = {
            baseURL: 'https://api.helpscout.net/v2/',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
        // console.log(helpscoutConfig)
        return done(null, helpscoutConfig)
    }
))

app.get('/', (req, res) => res.send('<h1>testing OAuth2 with Helpscout ... Good Luck!<h1>'))

app.get('/auth/example', passport.authenticate('oauth2'))

app.get('/auth/example/callback', passport.authenticate('oauth2', { session: false, successRedirect: '/mailbox', failureRedirect: '/login' }))

app.get('/login', (req, res) => res.send( 'Failure Redirect: Login'))

app.get('/mailbox', (req, res) => {
    axios.get('/mailboxes', helpscoutConfig)
        .then(response => {
            console.log(JSON.stringify(response.data))
            res.send(JSON.stringify(response.data))
        })
        .catch(error => console.log('error'))

})

const PORT = process.env.PORT || 5000
app.listen(PORT)