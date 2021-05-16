/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var jsObject;
app.use(cors());
app.get('/api/v1/equipments', function (request, response, next) {
    var max = request.query.max;
    var last = request.query.last;
    // This is CORS-enabled for all origins
    var req = http.get("http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=" + max + "&last=" + last, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('\n');
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            jsObject = JSON.parse(body.toString());
        });
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
    response.send(jsObject);
});
app.listen(8080, function () { return console.log('CORS-enabled web server listening on port 8080'); });
//# sourceMappingURL=main.js.map