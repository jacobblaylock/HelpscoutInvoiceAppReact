const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy(['/auth/example', '/helpscout/accessToken', '/helpscout/mailboxes', '/helpscout/conversations', '/helpscout/thread'], { target: 'http://localhost:5000' }));
}