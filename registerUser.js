require('dotenv').load();
const hueAPI = require("node-hue-api").HueApi;
const hueIP = process.env.HUEIP,
const newUserName = null;  // The Hue Bridge will generate a User ID
const userDescription = "Amazon Dash Button User";

let displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};
let displayError = function(err) {
    console.log(err);
};
let hue = new hueAPI();
hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();