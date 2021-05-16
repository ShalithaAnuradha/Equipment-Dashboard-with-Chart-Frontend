/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
let http = require('http');
let express = require('express');
let cors = require('cors');
let app = express();
let jsObject;

app.use(cors());

app.get('/api/v1/equipments', (request, response, next) => {
  const max = request.query.max;
  const last = request.query.last;

  // This is CORS-enabled for all origins
  const req = http.get(`http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=${max}&last=${last}`, (res) => {
    console.log('STATUS: ' + res.statusCode);
    JSON.stringify(res.headers);
    // Buffer the body entirely for processing as a whole.
    const bodyChunks = [];
    res.on('data', (chunk) => {
      bodyChunks.push(chunk);
    }).on('end', () => {
      const body = Buffer.concat(bodyChunks);
      jsObject = JSON.parse(body.toString());
    });
  });

  req.on('error', (e) => {
    console.log('ERROR: ' + e.message);
  });

  response.send(jsObject);
});

app.listen(8080, () => console.log('CORS-enabled web server listening on port 8080'));
