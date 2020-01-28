# Buddy - Front-End Mobile Component
Buddy is a personal safety iOS app with three main features:
1. Users can invite friends to follow along on their trips using a web browser. Friends do not need to download the app! A URL link is sent out via a text message.
2. At the press of a button, the trip page will be updated with a danger status. Additionally emergency contacts saved to the app will get a text alert. 
3. The Check-In feature sends a text alert to emergency contacts if the user has not returned to a saved location (home, work, or school) within a designated time period. 

This repository contains the code for the iOS mobile component. 

## Installation
Clone this repository and run

```sh
npm install
```

Obtain a Google Maps iOS SDK key [here](https://developers.google.com/maps/documentation/ios-sdk/intro) and a Google Maps Geocoding API key [here](https://developers.google.com/maps/documentation/geocoding/start). The iOS SDK key should be placed in app.json:

```sh
"config": {
        "googleMapsApiKey": "YOUR API KEY HERE"
      }
```

The geocoding key should be placed in a .env file in the root of your folder with the .env added to your gitignore file. 

Install and deploy the corresponding back-end and web-based front-end component of the app. 

The app can run on an iOS simulator with the terminal command:

```sh
expo start
```

Please be sure to verify that the locations permission is set to "ALWAYS". Due to iOS 13's location permission changes the app cannot run on a physical device through Expo but can run on [TestFlight](https://developer.apple.com/testflight/). 


