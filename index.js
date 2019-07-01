const express = require('express')
const bodyParser = require('body-parser');
require('./services/passport')

const app = express()
app.use(bodyParser.json({limit: '10mb', extended: true}))
require('./routes/authRoutes')(app)
require('./routes/helpscoutRoutes')(app)
require('./routes/osticketRoutes')(app)

// app.get('/', (req, res) => res.send('<h1>testing OAuth2 with Helpscout ... Good Luck!<h1>'))

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000
app.listen(PORT)