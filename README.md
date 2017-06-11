# hue-dash-switch

Amazon's Dash button is an amazing little device. Why not use the button's capabilities to its fullest and turn it into a remote for my Philips Hue setup rather than a simple tool for quicker ordering?

*Note that this tutorial will show you how to control your entire Hue lightbulb setup with a Dash button rather than single lightbulbs. If you are interested in controlling single lightbulbs, Daniel Gallo posted a [great tutorial](http://www.danielgallo.co.uk/post/hack-an-amazon-dash-button-to-control-philips-hue-lights/) on just that.*

# Content
* [Node.js](#nodejs)
* [About .env](#env)
* [Installing Dependencies](#installing-dependencies)
* [Connecting Button to WiFi](#connecting-button-to-wifi)
* [Button's MAC address](#buttons-mac-address)
* [Bridge's IP address](#buttons-ip-address)
* [Creating new User in Bridge](#creating-new-user-in-bridge)
* [Running Script](#running-script)
* [LaunchDaemon](#launchdaemon)

# Node.js
This project is powered by Node.js. You need to have it installed on your computer before advancing any further. To check whether Node.js is running on your computer, run
```
$ node -v
```
If it outputs a version number, you are good to go. If not, download and install the lastest version of Node.js from the project's [website](https://nodejs.org/) or with Homebrew;
```
$ brew install node
```

# .env
I store the Dash button's MAC address, the Bridge's IP address and User name  in a .env file. For those of you not familiar with these: .env files provide a very clean way of storing passwords, access information or any kind of data in a single file. Other files can access this data, so you do not need to hardcode it into your scripts.

It is indispensable for this tutorial's success that you enter any information you are asked to enter into the given  [.env](../master/.env) file.

Dotenv, the required package for .env usage, will be installed in the next step.    

# Installing Dependencies


Install the dependencies using ```npm``` in your Terminal.

```
npm install
```
Finally, download the Amazon app to your smartphone ([iOS](https://itunes.apple.com/de/app/amazon/id348712880?mt=8), [Android](https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping)).

# Connecting Button to WiFi
Connect the Dash button to the Internet by following the button's default setup process using Amazon's app up until the product selection page. Make sure that you **do not select any products** in this very step! Simply exit the setup by closing the app, otherwise you would be buying something from Amazon every time you press the button.

# Button's MAC address
To make our final work, we need to know the button's MAC address. The node-dash-button library's findbutton-script listens for ARP requests on your local network, just like the ones being sent out with every click of the button.

To run the network listener by running
```
npm run findButton
```
then press on your Dash button. Its MAC address will now appear in the console.

Enter the MAC address after "DASHMACADDRESS" in the given [.env](../master/.env) file.

# Button's IP address
You need to find out its IP address so the script can talk to your Bridge. Open Philip's Hue companion app and navigate to Settings -> Hue bridges -> i -> Network settings. Temporarily switch off the DHCP toggle — the app will show you the Bridge's IP address.

Enter this IP address after "HUEIP" in the given [.env](../master/.env) file.


# Creating new User in Bridge
To access your Hue lightbulbs, you will need to register a new user in your Bridge by pressing the link button on the Bridge and running the given [registerUser.js](../master/registerUser.js) file with Node.js;
```
npm run registerUser
```


# Running Script
And that's it. Run the [app.js](../master/app.js) script by entering
```
$ sudo node app.js
```
into your console and you are good to go! Your Amazon Dash button is now a switch for your Philips Hue setup.

# LaunchDaemon
If you do not want to manually run the script with the `sudo node app.js` command every time your computer boots up or you simply dislike having an open console window running the script 24/7, I highly recommend using a LaunchDaemon for the script so macOS will run it in the background every time you start your computer.

Copy the given [huedash.plist](../master/huedash.plist) file to your Desktop.

**In the .plist file, edit $YOURNAME to your name and $SCRIPTPATH to app.js' path.** For me, that's com.maxrugen.huedash and ~/Developer/dash.

Now, copy the .plist into the LaunchDaemon folder, set the file's owner to root and edit the file's rights using the following command. Again, you **need to replace $YOURNAME with the name you just provided in the .plist**.
```
sudo cp ~/Desktop/huedash.plist /Library/LaunchDaemons/huedash.plist && sudo chown root /Library/LaunchDaemons/huedash.plist && sudo chmod 644 /Library/LaunchDaemons/huedash.plist && sudo launchctl load /Library/LaunchDaemons/huedash.plist && sudo launchctl start com.$YOURNAME.huedash
```

# Round Up
### You now have a script running which
* starts running every time you boot your computer,
* imports the provided information from the .env file,
* prints "Button press detected" in the console whenever you press your Dash button,
* checks whether all of your lightbulbs are turned on or off,
* changes their status to either off or on with a white value of 500 and 100% brightness,
* and prints either "Turning lights on..." or "Turning lights off..." in the console once it changed the lightbulbs's color.

Congrats! 🎉

---

I have not found out yet why running the script with `sudo` is necessairy. I would be very happy about any pull requests and/or [emails](mailto:hi@maxrugen.com) explaining me why that is the case.
