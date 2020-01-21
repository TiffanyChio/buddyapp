import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

const screen = Dimensions.get('window');
const MAP_HEIGHT = screen.height * 0.88;
const SCREEN_WIDTH = screen.width;
const ASPECT_RATIO = screen.width / MAP_HEIGHT;
const LATITUDE_DELTA = 0.0922 / 10;
const LONGITUDE_DELTA = (LATITUDE_DELTA * ASPECT_RATIO) / 10;

class MapScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      current_latitude: null,
      current_longitude: null,
      watchPosition: null,
      isPanicked: false,
    };
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };

  componentDidMount() {
    this.getLocationAsync();
  }

  // 1. Set initial location
  // 2. Turn on location watch
  // 3. Set up destination geofence
  getLocationAsync = async () => {
    const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});

    this.setState({
      current_latitude: location.coords.latitude,
      current_longitude: location.coords.longitude
    });

    // timeInterval is in milliseconds, so every 1 seconds
    // distance interval is in meters (1 meter = 3.3 feet)
    const watchPosition = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 1
    }, this.updateLocation);

    this.setState({
      watchPosition: watchPosition,
    })

    const { destination_latitude, destination_longitude } = this.props.navigation.state.params;

    const destination = [{
      latitude: destination_latitude,
      longitude: destination_longitude,
      radius: 10
    }];

    await Location.startGeofencingAsync("ARRIVE_AT_DEST", destination);
  }

  // foreground location watch is turned off when user navigates away from screen
  componentWillUnmount = () => {
    this.state.watchPosition.remove();
    console.log("Location Watch Cancelled");
  }

  // called by Watch Position
  // updates current location for the API
  // Mapview is not based on the class's states
  updateLocation = (location) => {
    console.log('updating location data: ', location.timestamp);
    console.log(`${location.coords.latitude}, ${location.coords.longitude}`);

    this.setState({
      current_latitude: location.coords.latitude,
      current_longitude: location.coords.longitude
    });

    const { tripID } = this.props.navigation.state.params;

    const data = {
      current_latitude: this.state.current_latitude,
      current_longitude: this.state.current_longitude
    };

    axios.patch(`https://buddy-api-ada.herokuapp.com/trips/${ tripID }`, data)
      .then((response) => {
        console.log('Successfully updated API location: ', response.data);
      })
      .catch((err) => {
        console.log('Error updating API location: ', err.response.data, err.response.status);

        const { userID } = this.props.navigation.state.params;

        // when user crosses destination geofence trip status is COMPLETE
        // when the app updates after this, it will be redirected to the Trip Complete Screen
        if (err.response.data.message === "Cannot update COMPLETE trips.") {
          this.state.watchPosition.remove();
          this.props.navigation.navigate('TripCompleteModal', {
            userID: userID
          });
        }
      });
  }

  onSMS = async () => {
    const { tripID } = this.props.navigation.state.params;
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [],
        `Track my trip with Buddy at: https://buddy-web-ada.herokuapp.com/${ tripID }`
      );
    } else {
      console.log("Can't send messages on this device");
    }
  }

  // 1. API trip status is updated
  // 2. TRIP_ID is removed from AsyncStorage
  // 3. destination geofence is removed
  // 4. app redirects to the main menu
  onCancel = () => {
    const { tripID, userID } = this.props.navigation.state.params;

    const data = {
      status: "CANCEL"
    };

    axios.patch(`https://buddy-api-ada.herokuapp.com/trips/${ tripID }`, data)
      .then((response) => {
        console.log('Successfully updated trip status to CANCEL: ', response.data);

        AsyncStorage.removeItem('TRIP_ID');
        Location.stopGeofencingAsync("ARRIVE_AT_DEST");

        this.props.navigation.navigate('MainMenu', {
          userID: userID
        })
      })
      .catch((err) => {
        console.log('Error updating trip status to CANCEL', err);
      });
  }

  onPanic = () => {
    const { tripID } = this.props.navigation.state.params;

    let data = {};
    if ( this.state.isPanicked ) {
      data = { status: "ONGOING" };
    } else {
      data = { status: "PANIC" };
      this.sendPanicText();
    }

    axios.patch(`https://buddy-api-ada.herokuapp.com/trips/${ tripID }`, data)
      .then((response) => {
        console.log('Successfully updated trip status: ', response.data);

        this.setState({
          isPanicked: !this.state.isPanicked,
        });
      })
      .catch((err) => {
        console.log('Error updating trip status to PANIC', err);
      });
  }

  // Twilio SMS sends panic notification via the back-end API
  // more secure for storing API key and back-end has easy access to user contact info
  sendPanicText = async () => {
    const { tripID, userID } = this.props.navigation.state.params;

    axios.post(`https://buddy-api-ada.herokuapp.com/users/${ userID }/trips/${ tripID }/panic`, {})
      .then((response) => {
        console.log('Sent out notifications: ', response.data);
      })
      .catch((err) => {
        console.log('Error could not send out notifications', err);
      });
  }

  render() {
    const { destination_latitude, destination_longitude, destination_address } = this.props.navigation.state.params;

    return (
      <View style={ styles.container }>
        { this.state.current_latitude === null ? <Text style={{ marginTop: 100, fontSize: 18, color: '#FFFFFF' }}>Loading...</Text> :
          <MapView
            provider={ "google" }
            style={ styles.map }
            showsUserLocation={ true }
            showsMyLocationButton={ true }
            followsUserLocation={ true }
            initialRegion={{
              latitude: this.state.current_latitude,
              longitude: this.state.current_longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <Marker
              coordinate={{
                "latitude": destination_latitude,
                "longitude": destination_longitude
              }}
              title={ destination_address }
              description={ "Destination" }
            />
          </MapView>
        }
        <View style={ styles.buttonBar }>
          <TouchableOpacity
            style={ styles.button }
            onPress={ this.onSMS }
          >
            <Octicons name="device-mobile" size={ 30 } color="#FFFFFF" />
            <Text style={ styles.buttonText }>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.button }
            onPress={ this.onPanic }
          >
            { this.state.isPanicked ?
              <MaterialCommunityIcons name="check-circle" size={ 75 } color="#70b800" />
              :
              <MaterialCommunityIcons name="alert-circle" size={ 75 } color="red" />
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.button }
            onPress={ this.onCancel }
          >
            <MaterialCommunityIcons name="exit-run" size={ 30 } color="#FFFFFF" />
            <Text style={ styles.buttonText }>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
  },
  map: {
    alignSelf: 'stretch',
    height: MAP_HEIGHT,
    borderColor: '#b7b7b7',
    borderWidth: 1,
  },
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingHorizontal: 40
  },
  button: {
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    color: "#FFFFFF"
  }
});

export default MapScreen;
