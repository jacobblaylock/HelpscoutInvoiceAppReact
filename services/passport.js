const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')

const keys = {
    helpscoutClientID: '94080494c1464f2c8f9b9d39adfacce2',
    helpscoutClientSecret: '264424344f514ea8be89e1cca7353076'
}

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://secure.helpscout.net/authentication/authorizeClientApplication',
    tokenURL: 'https://api.helpscout.net/v2/oauth2/token',
    clientID: keys.helpscoutClientID,
    clientSecret: keys.helpscoutClientSecret,
    // callbackURL: "https://mighty-journey-28056.herokuapp.com/auth/example/callback"
    callbackURL: "http://127.0.0.1:5000/auth/example/callback"
},
    (accessToken, refreshToken, profile, done) => {
        var helpscoutConfig = {
            baseURL: 'https://api.helpscout.net/v2/',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
        done(null, helpscoutConfig)
    }
))
