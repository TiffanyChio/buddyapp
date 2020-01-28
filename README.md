# Buddy - Front-End Mobile Component
Buddy is a personal safety iOS app with three main features:
1. Users can invite friends to follow along on their trips using a web browser. Friends do not need to download the app! A URL link is sent out via a text message.
2. At the press of a button, the trip page will be updated with a danger status. Additionally emergency contacts saved to the app will get a text alert. 
3. The Check-In feature sends a text alert to emergency contacts if the user has not returned to a saved location (home, work, or school) within a designated time period. 

This repository contains the code for the iOS mobile component built with React-Native and Expo. The [back-end API](https://github.com/TiffanyChio/buddyapi) and [web component](https://github.com/TiffanyChio/buddyweb) will need to be installed and deployed for the App to work as intended.

[Visit youtube for a short video demo]() of the app (no audio available). 

## Prerequisites
Obtain a Google Maps iOS SDK key [here](https://developers.google.com/maps/documentation/ios-sdk/intro) and a Google Maps Geocoding API key [here](https://developers.google.com/maps/documentation/geocoding/start). 

## Installation
Clone this repository and install project dependencies by running:

```sh
npm install
```

The Google Maps iOS SDK key should be placed in app.json:

```sh
"config": {
        "googleMapsApiKey": "YOUR API KEY HERE"
      }
```

The geocoding key should be placed in a .env file in the root of your project repository. Please verify that .env is included in the .gitignore file also located within the root directory. If .env is missing from your .gitignore file then your API key may be compromised in the future.  

The app can run on an iOS simulator with the terminal command:

```sh
expo start
```

Please be sure to verify that the locations permission is set to "ALWAYS". Due to iOS 13's location permission changes the app cannot run on a physical device through Expo but can run via [TestFlight](https://developer.apple.com/testflight/). 

## Common Issues
### Trouble signing into the App due to missing btoa.
Run ```npm install```. The issue may be due to the axios version.

### Geofences do not appear to work.
Make sure that the location permissions for the client that the app is running on: Expo for iOS simulator or TestFlight on physical devices is set to ALWAYS.
