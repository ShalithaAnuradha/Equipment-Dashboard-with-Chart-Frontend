/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
var http = require('http');
var options = {
    host: 'http://ivivaanywhere.ivivacloud.com',
    path: '/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=10&last=0'
};
var jsObject;
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
app.get('/api/v1/equipments', function (request, response, next) {
    var max = request.query.max;
    var last = request.query.last;
    console.log('--------------------------------------');
    console.log(max);
    console.log(last);
    // res.json({msg: 'This is CORS-enabled for all origins!'});
    var req = http.get("http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=" + max + "&last=" + last, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('\n');
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function (chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            // console.log('BODY: ' + body);         //--------------------See the body--------
            console.log('\n');
            jsObject = JSON.parse(body.toString());
            console.log(typeof jsObject);
            var noOfElements = 0;
            for (var _i = 0, jsObject_1 = jsObject; _i < jsObject_1.length; _i++) { // --------------------See each equipment------
                var index = jsObject_1[_i];
                noOfElements++;
                // console.log(index);
            }
            console.log('N:' + noOfElements);
            // ...and/or process the entire body here.
        });
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
    response.send(jsObject);
});
app.listen(8080, function () { return console.log('CORS-enabled web server listening on port 80'); });
//# sourceMappingURL=main.js.map