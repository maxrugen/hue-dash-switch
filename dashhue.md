I have always been a huge fan of Philips' Hue ecosystem and what you can do with it. Recently, I stumbled upon a great project which really caught my attention. A friend of mine, turned some Dash buttons into remotes for his Hue setup. Amazon launched the Dash buttons a while ago providing its users a very easy way to stock up on pre-selected household items. Basically, they are a $5 IoT device with a WiFi chip. I decided to order one trying to figure out how to do this.

After some googling I found out that Alex Hortin published a [Node.js library](https://github.com/hortinstein/node-dash-button) for the Dash buttons on GitHub which listens for ARP requests on your local network. I remembered finding a [Node.js library for the Hue lightbulbs](https://github.com/peter-murray/node-hue-api) on GitHub (kudos to Peter Murray). Given these two libraries, I should be able to use my Dash button as a remote for my Hue setup.
That is when I found Daniel Gallo's great [blog post](http://www.danielgallo.co.uk/post/hack-an-amazon-dash-button-to-control-philips-hue-lights/) on this exact topic. Although it guided me through the whole process pretty well, I came up with a solution that merges both Daniel's approach and the [netflixandchill project](https://github.com/sidho/netflixandchill). This is how I did it.
#### Set up the Dash button
Starting off you need to setup the Dash button via the Amazon app on your smartphone. This can be done by accessing Your Account -> Dash Devices -> Set up a new Device. Enter your WiFi password and press the Dash button for 6 seconds to turn it into activation mode. Make sure that you do not select any products in the next step and simply exit the setup, otherwise you would buy something from Amazon every time you press the button.
#### Install the Dependencies
Next up, you need to install the Node libraries our project depends on on your local machine. I recommend using `npm` for that.
`npm install node-hue-api`, `npm install node-dash-button` and `npm install dotenv`.
#### Find the Dash button's MAC address
The Dash Node library listens for ARP requests on your local network. In order to make our script work, we need to know which device will be sending out these requests. Luckily, the Dash Node library provides a network listener so you do not have to look up your Dash button's MAC address in your router's settings.
You can access the network listener by running the following command in your console:
`cd node_modules/node-dash-button && node bin/findbutton`

Pressing the button on the Dash button, your device's MAC adress will pop up in your console.

>Watching for arp requests on your local network, please try to press your dash now
possible dash hardware address detected:  44:65:0d:74:76:e0

The output will vary on your machine since this MAC address is my Dash button's.

### Create a new User in the Hue Bridge
To access your Hue lightbulbs, you will need to register a new user in your Bridge by pressing the link button on the Bridge and running a simple script. Create a new file, name it "hueuser" and enter the following snippet:
```javascript
var HueApi = require("node-hue-api").HueApi;
var hostname = "192.168.0.100",  // IP of the Philips Hue Bridge
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
```
Now, run the script by entering `node hueuser` in the console. Your console will return a randomly generated User ID.
### Create an .env file
We're almost done with the basic setup for this project. You will now need to create a new file called ".env" in your project folder. This file provides our final script with your Dash MAC address, your Hue Bridge's IP address and the User ID that we generated earlier.
You could also insert this data into the script itself but although you need to install another dependency, "dotenv", (which we have already done,) I find this approach to be much cleaner.
Enter the following snippet into your .env file and make sure to edit it so it contains your personal data:

```javascript
DASHMACADDRESS=44:65:0D:74:76:E0
HUEIP=192.168.0.100
HUEUSERNAME=Z6tfJkWYZDtHS7vC21U14TsZYgqB8G8fdXLfXQo4
```

###### The next step varies depending on whether you want the Dash button to control all of your Hue lightbulbs or just a group of lightbulbs.
I control my entire Hue setup via the Dash button. If you want to use only some of your lightbulbs via the Dash button, head over to Daniel Gallo's great [tutorial](http://www.danielgallo.co.uk/post/hack-an-amazon-dash-button-to-control-philips-hue-lights/). My tutorial will not show you how to control a group but all of your lightbulbs.
### Write the on/off script
This is the part where most of the magic happens. As I was writing my own script, Daniel's approach did not work for me as I wanted it to, so I looked at another approach on how to turn the Dash button into a remote for the Hue lightbulbs, the [netflixandchill](https://github.com/sidho/netflixandchill) one.
I merged the two scripts and came up with the following code which you will need to copy & paste into a new .js file.

```
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
```
This script will import the information we provide in the .env file, print "Button press detected" in the console whenever you press your Dash button, check whether all of your lightbulbs are turned on or off and changes their status to either off or on, with a white value of 500 and 100% brightness. Once the script changed the color of your lightbulbs, it prints either "Turning lights on..." or "Turning lights off..." in the console.

Since the color value is a HSL value, you can modify it as much as you want to. The netflixandchill file originally came with a red-ish color, value 350.

#### Run the script
Basically, that was everything we needed to code. You now have a script which, with the power of Node.js, can turn on or off all of your Hue lightbulbs whenever you press your Dash button. I named my file "app.js", so if I want to run it, I need to type `sudo node app.js` in the console. Note that you still need to be in the file's directory in order to be able to access it. I found out that sadly, for whatever reason, running the script without `sudo` did not work for me.

This is what your output will look like once you have pushed the Dash button's button:

>Button press detected

>Turning lights on...

or

>Button press detected

>Turning lights off...


####Create a LaunchDaemon for the script
If you do not want to manually have to run the script with the `sudo node $SCRIPTNAME.js` command every time your computer boots up or you simply dislike having an open Terminal.app window running the script 24/7, I highly recommend creating a LaunchDaemon for the script so macOS will run it in the background every time you start your computer.
[Launchd.info](http://www.launchd.info) and [this blog post](http://www.sgiersch.de/auf-einem-mac-ein-node-script-per-deamon-aufrufen/) from Stephan Giersch (sorry, this site is German only) helped me figuring out all the things I needed to know to create such a LaunchDaemon.

_If you would rather want to run the script on a Raspberry Pi and dislike the usage of LaunchDaemons, skip my tutorial's next step and head over to this [guide through](http://weworkweplay.com/play/raspberry-pi-nodejs/) on how to setup Node.js on your Raspberry Pi._


First of all, you create a new text file on your Desktop and name it "huedash.plist". Now, you copy & paste the following snippet into your file:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.$YOURNAME.huedash</string>

    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/node</string>
      <string>~/$SCRIPTPATH/$SCRIPTNAME.js</string>
    </array>

    <key>WorkingDirectory</key>
	  <string>~/$SCRIPTPATH</string>

    <key>StandardOutPath</key>
    <string>~/$SCRIPTPATH/huedash.log</string>

    <key>StandardErrorPath</key>
    <string>~/$SCRIPTPATH/huedash.log</string>

    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>

  </dict>
</plist>
```

Edit $YOURNAME to your name, $SCRIPTPATH to the on/off script's path and $SCRIPTNAME to the on/off script's name. For me, that's com.maxrugen.huedash, ~/development/dash and app.js.

Next up, you will need to copy the .plist into the LaunchDaemon folder, set the file's owner to root and edit the file's rights. Copy & paste the following text into your Terminal.app. Again, you need to replace $YOURNAME with the name you just provided in the .plist. Once you are done, hit enter.
```
sudo cp ~/Desktop/huedash.plist /Library/LaunchDaemons/huedash.plist && sudo chown root /Library/LaunchDaemons/huedash.plist && sudo chmod 644 /Library/LaunchDaemons/huedash.plist && sudo launchctl load /Library/LaunchDaemons/huedash.plist && sudo launchctl start com.$YOURNAME.huedash
```
Since this will load up your script in the background, you will not see any visual feedback in a console whenever you use your Dash button. I worked around this tricky part by adding
```
<key>StandardOutPath</key>
<string>~/$SCRIPTPATH/huedash.log</string>

<key>StandardErrorPath</key>
<string>~/$SCRIPTPATH/huedash.log</string>
``` to the .plist. The script will now log every button press and every error that might occur to the file ~/$SCRIPTPATH/huedash.log.

---
And that's it! You have now turned your Amazon Dash button into a remote that lets you turn on and off all of your Philips Hue lightbulbs with a single click. If you have any questions, hit me up on Twitter @[maxrugen_](https://twitter.com/maxrugen_) or fire out an email to [hi@mecki.space](mailto:hi@mecki.space). Stay peachy! 💯
