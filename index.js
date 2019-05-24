const express = require('express')
const bodyParser = require('body-parser');
require('./services/passport')

const app = express()
app.use(bodyParser.json())
require('./routes/authRoutes')(app)

app.get('/', (req, res) => res.send('<h1>testing OAuth2 with Helpscout ... Good Luck!<h1>'))

const PORT = process.env.PORT || 5000
app.listen(PORT)