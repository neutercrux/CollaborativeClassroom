module.exports = function(app) {
    var webapp = require('../controller/Controller');

app.route('/api/v1/users/:usn/:password')
    .get(webapp.loginUser)
app.route('/api/v1/register')
    .post(webapp.signUp)

app.route('/api/v1/langs')
    .get(webapp.getLangs)
app.route('/api/v1/run')
    .post(webapp.runCode)
}
