module.exports = function(app) {
    var webapp = require('../controller/Controller');

app.route('/api/v1/users/:usn/:password')
    .get(webapp.loginUser)
app.route('/register')
    .post(webapp.signUp)
app.route('/items')
    .get(webapp.getItems)
app.route('/langs')
    .get(webapp.getLangs)
app.route('/run')
    .post(webapp.runCode)
}
