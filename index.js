
// Start up errors
//client fails - (move into its own method to unit test it?)

// TODO: Send client to home page if route not found...
// TODO: Send client to home page when hitting the / route

// if i want to move over to es6...
// https://www.codementor.io/iykyvic/writing-your-nodejs-apps-using-es6-6dh0edw2o
var dotenv = require('dotenv').config({path: './.env'});
var express = require('express');
var bodyParser = require('body-parser');

var coinbase = require('coinbase');
var plaid = require('plaid');

var axios = require('axios');
var moment = require('moment');

var APP_PORT = process.env.APP_PORT;

var PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
var PLAID_SECRET = process.env.PLAID_SECRET;
var PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
var PLAID_ENV = process.env.PLAID_ENV;

// Initialize the Plaid client
PLAID_CLIENT = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV]
);

// Coinbase fields needed to create oauth2 client
var app = express();
// app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// allows cross origin requests 
// on C9 dev environment, dev client is at port 8080, server is at port 8081.
// because the server is a different origin than client
// requires that cross origin requests are active
app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO: send the React app. 
app.get('/', function(request, response, next) {
  console.log('Welcome home!');
  response.send('You made it');
  // response.render('index.ejs', {
  //   PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
  //   PLAID_ENV: PLAID_ENV,
  // });
});

require('./plaid/save_access_token')(app);
require('./plaid/get_transactions')(app);
require('./plaid/get_loose_change')(app);

require('./coinbase/auth_redirect')(app);
require('./coinbase/access_token_redirect')(app);
require('./coinbase/buy')(app);

console.log('Hello!');
console.log(moment());
console.log('Is heroku port set?', process.env.PORT);
var port = process.env.PORT || APP_PORT || 3000
var server = app.listen(port, function() {
  console.log('spare-coin-investing server listening on port ' + port);
});