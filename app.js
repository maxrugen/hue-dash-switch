require('dotenv').load();
const dashButton = require('node-dash-button');
const hue = require("node-hue-api");
const hueAPI = hue.HueApi;
const hueIP = process.env.HUEIP;
const hueUsername = process.env.HUEUSERNAME;
const dashMAC = process.env.DASHMACADDRESS;
const dash = dashButton(dashMAC);

let lightState = hue.lightState;
const api = new hueAPI(hueIP, hueUsername);
let state = lightState.create();

dash.on("detected", dashId => {
    console.log("Button press detected", dashId);

    api.lights().then(result => {
        let lights = result.lights;

        lights.forEach(light => {
            let isOn = light.state.on;

            if (isOn) {
                api.setLightState(light.id, state.off()).done();
            } else {
                api.setLightState(light.id, state.on()).done();
            }
        });
    });

});
