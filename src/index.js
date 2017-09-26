var request = require("request"),
    fs = require('fs'),
    prompt = require('prompt'),
    schema = {
      properties: {
        datasetID: {
          pattern: /^[0-9\s\-]+$/,
          message: 'Dataset ID (must be a number):',
          required: true
        },
      outputFile: {
        message: 'Output filename, keep empty for default value [./output/DatasetID.geojson]'
      }
    }
  };


getPropmt = (err, res) => {
  if(err) console.log(err);
  if(!res.outputFile) { res.outputFile = './output/'+res.datasetID+'.geojson'}
  dataRequest(res.datasetID, res.outputFile);
}

dataRequest = (datasetID, outputFile) => {
  var url = 'http://api.data.mos.ru/v1/datasets/' + datasetID + '/features?';
  console.log("Request...");
  request({
        url: url,
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          if(body.features.length>0) {
            body.features.forEach(function(d) {
              d.properties = d.properties['Attributes'];
            });

            fs.writeFile(outputFile, JSON.stringify(body), function(err) {
              if(err) {
                return console.log(err);
              }
                console.log("Dataset #"+datasetID+" saved to " + outputFile);
              });

          } else {
            console.log("Empty data");
          }

        } else console.log(error);
    });
}

prompt.get(schema, getPropmt);
