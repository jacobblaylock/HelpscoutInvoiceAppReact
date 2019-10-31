const promisify = require('util').promisify
const axios = require('axios')
const fs = require("fs")

// Interceptor to handle API limit
function retryCall(url, config) {
  return axios.get(url, config)
}

axios.interceptors.response.use(response => {
  console.log(response.headers['x-ratelimit-remaining-minute'])
  return response
}, error => {
  if (error.response) {
    if (error.response.status === 429) {
      console.log(`Error: ${error.response.status} - ${error.response.data.message}. Retrying in ${error.response.data.retry_after} seconds`)
      let wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
      return wait(error.response.data.retry_after * 1000).then(() => {
        return retryCall(error.config.url, { headers: { Authorization: error.config.headers.Authorization } })
          .then()
          .catch(Promise.reject(error))
      })
    } else if (error.response.status === 401) {
      console.log('Returned 1')
      return Promise.reject({ status: 401, message: 'Authorization Token Expired' })
    } else {
      console.log('Returned 2')
      return Promise.reject({ status: 404, message: 'Error connecting to Helpscout' })
    }
  } else {
    console.log('Returned 3')
    return Promise.reject({ status: 404, message: 'Error connecting to Helpscout'})
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

  app.get('/helpscout/conversations', (req, res) => {
    const params = req.query
    axios.get('/conversations', { params })
      .then(response => {
        return { ...response.data.page, link: response.data._links.page.href.replace('{&page}', '') }
      })
      .then(response => {
        let links = []
        for (let i = 1; i <= response.totalPages; i++) {
          links.push(`${response.link}&page=${i}`)
        }
        axios.all(links.map(link => axios.get(link)))
          .then(response => {
            let conversations = response.reduce((acc, cur) => {
              let conversation = cur.data._embedded.conversations
              return [...acc, ...conversation]
            }, [])
              .map(convo => {
                var clientId = convo.customFields.find(cf => cf.id === 1241)
                var billableHours = convo.customFields.find(cf => cf.id === 1240)
                return {
                  id: convo.id,
                  number: convo.number,
                  status: convo.status,
                  createdAt: convo.createdAt,
                  closedAt: convo.status === 'closed' ? convo.closedAt : '',
                  modifiedAt: convo.userUpdatedAt,
                  assignee: convo.assignee || {
                      "type": "user",
                      "first": "Unassigned",
                      "last": "Unassigned",
                      "email": "support@peakmedicaltech.com"
                  },
                  clientId: clientId ? clientId.value : "NO CLIENT SELECTED",
                  billableHours: billableHours
                    ? (billableHours.value === '' ? 0 : billableHours.value)
                    : 0,
                  subject: convo.subject,
                  preview: convo.preview,
                  threadLink: convo._links.threads.href
                }
              })
            res.send(conversations)
          })
      })
      .catch(error => {
        res.status(error.status).send(error.message)
      })
  })

  app.get('/helpscout/thread', (req, res) => {
    axios.get(req.query.link)
      .then(response => {
        let conversationId = response.data._links.self.href.match(/(?<=https:\/\/api\.helpscout\.net\/v2\/conversations\/)\d*(?=\/threads\/)/)[0]
        res.send({ [conversationId]: response.data._embedded.threads })
      })
      .catch(error => {
        res.status(error.status).send(error.message)
      })
  })
}