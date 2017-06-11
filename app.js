require('dotenv').load();
const dashButton = require('node-dash-button');
const hue = require("node-hue-api");

const HueApi = hue.HueApi;
const hueIp = process.env.HUEIP;
const hueUsername = process.env.HUEUSERNAME;

const lightState = hue.lightState;
const api = new HueApi(hueIp, hueUsername);
const state = lightState.create();

const dashMacAddress = process.env.DASHMACADDRESS;
const dash = dashButton(dashMacAddress);

dash.on("detected", dashId => {
    console.log("Button press detected", dashId);

    api.lights().then(result => {
        const lights = result.lights;

        lights.forEach(light => {
            const isOn = light.state.on;

            if (isOn) {
                api.setLightState(light.id, state.off()).done();
            } else {
                api.setLightState(light.id, state.on()).done();
            }
        });
    });

});
