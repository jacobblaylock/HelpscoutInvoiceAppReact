const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')
const keys = require('../config/keys');

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://secure.helpscout.net/authentication/authorizeClientApplication',
  tokenURL: 'https://api.helpscout.net/v2/oauth2/token',
  clientID: keys.helpscoutClientID,
  clientSecret: keys.helpscoutClientSecret,
  callbackURL: "/auth/helpscout/callback",
  proxy: true
},
  (accessToken, refreshToken, profile, done) => {
    var helpscoutConfig = {
      baseURL: 'https://api.helpscout.net/v2/',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
    console.log(helpscoutConfig)
    done(null, helpscoutConfig)
  }
))
