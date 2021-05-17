/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var totalArray = []; // : Array<Equipment> = [];
var fullArraySize;
// import {Equipment} from './model/equipment';
app.use(cors());
app.get('/api/v1/equipments', function (request, response, next) {
    var max = request.query.max;
    var last = request.query.last;
    var noOfEquipmentsPerPage = 50;
    console.log(last, max, totalArray.length);
    // totalArray must include either all the data or it should be empty. If it is empty it is filled using true part of
    // if condition. If it is filled, then no need to send get request again in future to send the equipment array. Same
    // totalArray can be reused.
    if (totalArray.length === 0) {
        for (var i = 0; i <= max; i += 50) {
            // This is CORS-enabled for all origins
            var req = http.get("http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=" + noOfEquipmentsPerPage + "&last=" + i, function (res) {
                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    // Add data to bodyChunk array
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    // Concatenate all the buffer objects into one buffer object.
                    var body = Buffer.concat(bodyChunks);
                    // Get the toString value of that buffer object and Convert it to a JS Object.
                    var partialArray = JSON.parse(body.toString());
                    // Add the partialArray to the totalArray.
                    totalArray.push.apply(totalArray, partialArray);
                });
            });
            req.on('error', function (e) {
                console.log('ERROR: ' + e.message);
            });
        }
    }
    else {
        // Adding this if condition may not be necessary, but to provide a better result for everytime (considering the
        // cache issues), providing this if condition is a good solution.
        if (totalArray.length !== 298) {
            totalArray = [];
        }
    }
    // Here the respond is send through a setTimeout(with zero time delay) to ensure this response will send after the
    // execution of the whole code in the backend because receiving data via a server(in internet) take a little time
    // and it may causes to provide the output than expected one. (Ex: Before receiving the data, the response can be sent).
    setTimeout(function () {
        response.send(totalArray);
    }, 0);
});
app.listen(8080, function () { return console.log('CORS-enabled web server listening on port 8080'); });
//# sourceMappingURL=main.js.map