const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
    app.use(proxy(['/auth/example', '/auth/example/callback'], { target: 'http://localhost:5000' }));
}