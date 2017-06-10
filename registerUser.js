require('dotenv').load();
var HueApi = require("node-hue-api").HueApi;
var hostname = process.env.HUEIP,
    newUserName = null;  // The Hue Bridge will generate a User ID
    userDescription = "Amazon Dash Button User";
var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};
var displayError = function(err) {
    console.log(err);
};
var hue = new HueApi();
hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();
