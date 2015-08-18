// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");

var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: true }));
app.set('port', (process.env.PORT || 8000));
require('./server/config/routes.js')(app);
// static content
app.use(express.static(path.join(__dirname, "./client")));

// listen on 8000
app.listen(app.get('port'), function() {
 console.log("listening on port", app.get('port'));
})











