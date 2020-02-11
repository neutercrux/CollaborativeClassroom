module.exports = function(app) {
    var webapp = require('../controller/Controller');

app.route('/api/v1/users/:usn/:password')
    .get(webapp.loginUser)
app.route('/register')
    .post(webapp.signUp)

}
