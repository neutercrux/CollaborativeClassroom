var fs = require('fs'),
redis = require('redis');

var client;
fs.readFile('creds.json', 'utf-8', function(err, data) {
    if(err) throw err;
    creds = JSON.parse(data);
    client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port);

        client.get('test', function(err, reply) {
            if (reply) {
                console.log(reply);
            }
        });
    // });
    // console.log(client);
});

module.exports = client;