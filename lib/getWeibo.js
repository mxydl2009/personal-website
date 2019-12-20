var https = require('https');
module.exports = function (access_token, count, cb) {
        var options = {
            host: 'api.weibo.com',
            port: 443,
            method: 'GET',
            path: '/2/statuses/user_timeline.json?access_token=' + access_token
        }
        var responseData = '';
        https.get(options, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                responseData = JSON.parse(data).statuses.slice(0, count);
                cb(responseData);
            });
        }).on('error', function (e) {
            console.error(e);
        });
    }