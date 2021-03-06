module.exports = function(app) {
    var webapp = require('../controller/Controller');

app.route('/')
    .get(webapp.index)
app.route('/api/v1/users/')
    .post(webapp.loginUser)
app.route('/api/v1/register')
    .post(webapp.signUp)

app.route('/api/v1/langs')
    .get(webapp.getLangs)
app.route('/api/v1/run')
    .post(webapp.runCode)
app.route('/api/v1/ip')
    .get(webapp.getIpAdd)
app.route('/api/v1/update')
    .post(webapp.updateData)
}
