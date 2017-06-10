require('dotenv').load();
var dashButton = require('node-dash-button'),
    hue = require("node-hue-api");
    dash = dashButton(process.env.DASHMACADDRESS),
    HueApi = hue.HueApi,
    hueIp = process.env.HUEIP,
    hueUsername = process.env.HUEUSERNAME,
    lightState = hue.lightState,
    api = new HueApi(hueIp, hueUsername),
    on = false;

state = lightState.create()

dash.on("detected", function() {
    console.log("Button press detected");

    if (!on) {
        // Turn on the group of lights with warm white value of 500 and 100% brightness.
        api.setGroupLightState(0, state.on().white(500, 100))
            .then(console.log("Turning lights on..."))
            .done();
    } else {
        // Turn off the group of lights
        api.setGroupLightState(0, state.off())
            .then(console.log("Turning lights off..."))
            .done();
    }

    on = !on;
});
