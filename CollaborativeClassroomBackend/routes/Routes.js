module.exports = function(app) {
    var webapp = require('../controller/Controller');

app.route('/api/v1/users')
    .get(webapp.loginUser)
    .post(webapp.signUp)

}
