const passport = require('passport')
const promisify = require('util').promisify
const axios = require('axios')
const circularJSON = require('circular-json')
const fs = require("fs")

function retryCall(url, headers) {
    return axios.get(url, headers)
}

axios.interceptors.response.use(response => {
    console.log(response.headers['x-ratelimit-remaining-minute'])
    return response
}, error => {
    console.log('Error Status: ' + error.response.status)
    console.log(error.retry_after) // error.config.url, error.config.headers
    if (error.response.status === 429) {
        let wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
        return wait(60000).then(() => {
            console.log('...retrying')
            return retryCall(error.config.url, { headers: { Authorization: error.config.headers.Authorization }}).then()
        })
    }else {
        return Promise.reject(error);
    }
})

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

    app.get('/api/accessToken', (req, res) => {
        var helpscoutConfig
        promisify(fs.readFile)('./temp/helpscoutConfig.json', 'utf-8')
            .then(file => res.send(file))
    })

    app.post('/api/thread', (req, res) => {
        axios.get(req.body.link, { headers: req.body.headers })
            .then(response => {
                res.send(response.data._embedded.threads)
            })
            .catch(error => {
                return error
            })
    })
}