/**
 * @author : Shalitha Anuradha <shalithaanuradha123@gmail.com>
 * @since : 2021-05-14
 **/
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
let totalArray = []; // : Array<Equipment> = [];
let fullArraySize;
// import {Equipment} from './model/equipment';
app.use(cors());

app.get('/api/v1/equipments', (request, response, next) => {
  const max = request.query.max;
  const last = request.query.last;
  const noOfEquipmentsPerPage = 50;
  console.log(last, max, totalArray.length);

  // totalArray must include either all the data or it should be empty. If it is empty it is filled using true part of
  // if condition. If it is filled, then no need to send get request again in future to send the equipment array. Same
  // totalArray can be reused.
  if (totalArray.length === 0) {
    for (let i = 0; i <= max; i += 50) {

      // This is CORS-enabled for all origins
      const req = http.get(`http://ivivaanywhere.ivivacloud.com/api/Asset/Asset/All?apikey=SC:demo:64a9aa122143a5db&max=${noOfEquipmentsPerPage}&last=${i}`, (res) => {

        // Buffer the body entirely for processing as a whole.
        const bodyChunks = [];
        res.on('data', (chunk) => {

          // Add data to bodyChunk array
          bodyChunks.push(chunk);
        }).on('end', () => {

          // Concatenate all the buffer objects into one buffer object.
          const body = Buffer.concat(bodyChunks);

          // Get the toString value of that buffer object and Convert it to a JS Object.
          const partialArray = JSON.parse(body.toString());

          // Add the partialArray to the totalArray.
          totalArray.push(...partialArray);
        });
      });

      req.on('error', (e) => {
        console.log('ERROR: ' + e.message);
      });
    }
  } else {
    // Adding this if condition may not be necessary, but to provide a better result for everytime (considering the
    // cache issues), providing this if condition is a good solution.
    if (totalArray.length !== 298) {
      totalArray = [];
    }
  }

  // Here the respond is send through a setTimeout(with zero time delay) to ensure this response will send after the
  // execution of the whole code in the backend because receiving data via a server(in internet) take a little time
  // and it may causes to provide the output than expected one. (Ex: Before receiving the data, the response can be sent).
  setTimeout(() => {
    response.send(totalArray);
  }, 0);
});

app.listen(8080, () => console.log('CORS-enabled web server listening on port 8080'));
