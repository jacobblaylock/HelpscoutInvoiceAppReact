const promisify = require('util').promisify
const axios = require('axios')
const fs = require("fs")

// Interceptor to handle API limit
function retryCall(url, headers) {
    return axios.get(url, headers)
}

axios.interceptors.response.use(response => {
    console.log(response.headers['x-ratelimit-remaining-minute'])
    return response
}, error => {
    if(error.response) {
        if (error.response.status === 429) {
            console.log(`Error ${error.response.status}: ${error.response.data.message}. Retrying in ${error.response.data.retry_after} seconds`)
            // TODO: Promisify setTimeout
            let wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
            return wait(error.response.data.retry_after * 1000).then(() => {
                return retryCall(error.config.url, { headers: { Authorization: error.config.headers.Authorization } }).then()
            })
        }else{
            console.log(error)
            return Promise.reject(error)
        }
    } else {
        console.log(error)
        return Promise.reject(error);
    }
})

// Routes
module.exports = app => {
    app.get('/helpscout/accessToken', (req, res) => {
        promisify(fs.readFile)('./temp/helpscoutConfig.json', 'utf-8')
            .then(file => res.send(file))
    })

    app.get('/helpscout/mailboxes', (req, res) => {
        axios.get('/mailboxes/79656')
            .then(response => {
                res.send(response.data)
            })
    })

    app.post('/helpscout/thread', (req, res) => {
        axios.get(req.body.link, { headers: req.body.headers })
            .then(response => {
                res.send(response.data._embedded.threads)
            })
            .catch(error => {
                console.log(error)
                return error
            })
    })
}