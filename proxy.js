/***
 * Proxy App
 * Service to forward get and post requests
 */
var express    = require('express');
var bodyParser = require('body-parser');
var cors       = require('cors');
var axios      = require('axios');
var config     = require('getconfig');

var app = express();

app.use(bodyParser.json());

app.use(cors({origin:config.corsDomain})); //set the cross origin resource sharing url
const port = config.proxyApplicaitonPort; //application port number
const apiUrl = config.forwardingUrl; //recast API URL

//Add Headers to request for proxy
/*const headers = {
  'Accept': 'application/json',
  'Authorization': config.recastApiToken
}*/
const headers=config.headerParams;

//http get controller for proxy service
app.get('/*', function (req, res) {
  const target = apiUrl + req.url;
  console.log(target);
  //fires off get with appended headers
  axios.get(target, { headers: headers })
    .then(result => {
      //console.log(result.data);
      res.send(result.data); //returns response
    })
    .catch(error => {
      if(error.response!=null&&error.response.status!=null)
        res.send(`${error.response.status}: ${target}\n\n${JSON.stringify(headers, null, 2)}`);
      else
        res.send(`${error.response}: ${target}\n\n${JSON.stringify(headers, null, 2)}`);
    });
});

//Post action controller for proxy service
app.post('/*', function (req, res) {
  const target = apiUrl + req.url;
  console.log(target);
  //fires off post with appended headers
  axios.post(target, req.body, { headers: headers })
    .then(result => {
      //console.log(result.data);
      res.send(result.data);
    })
    .catch(error => {
      if(error.response!=null&&error.response.status!=null)
        res.send(`${error.response.status}: ${target}\n\n${JSON.stringify(headers, null, 2)}`);
      else
        res.send(`${error.response}: ${target}\n\n${JSON.stringify(headers, null, 2)}`);
    });
});

//starts app on given port
app.listen(port, () => console.log(`Proxy App Launching on port: ${port}!`))