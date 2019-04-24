const express = require('express')
const cors = require('cors')
require('./services/passport')

const app = express()
// app.use(cors())
require('./routes/authRoutes')(app)

app.get('/', (req, res) => res.send('<h1>testing OAuth2 with Helpscout ... Good Luck!<h1>'))

const PORT = process.env.PORT || 5000
app.listen(PORT)