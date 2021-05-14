/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
let http = require('http');
let options = {
  host: 'http://ivivaanywhere.ivivacloud.com',
  path: '/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=10&last=0'
};
let jsObject;



let express = require('express');
let cors = require('cors');
let app = express();

app.use(cors());

app.get('/api/v1/equipments', (request, response, next) => {
  const max = request.query.max;
  const last = request.query.last;
  console.log('--------------------------------------');
  console.log(max);
  console.log(last);

  // res.json({msg: 'This is CORS-enabled for all origins!'});
  const req = http.get(`http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=${max}&last=${last}`, (res) => {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    console.log('\n');
    // Buffer the body entirely for processing as a whole.
    const bodyChunks = [];
    res.on('data', (chunk) => {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', () => {
      const body = Buffer.concat(bodyChunks);
      // console.log('BODY: ' + body);         //--------------------See the body--------
      console.log('\n');
      jsObject = JSON.parse(body.toString());
      console.log(typeof jsObject);

      let noOfElements = 0;
      for (const index of jsObject) {      // --------------------See each equipment------
        noOfElements++;
        // console.log(index);
      }
      console.log('N:' + noOfElements);

      // ...and/or process the entire body here.
    });
  });

  req.on('error', (e) => {
    console.log('ERROR: ' + e.message);
  });

  response.send(jsObject);
});

app.listen(8080, () => console.log('CORS-enabled web server listening on port 80'));
