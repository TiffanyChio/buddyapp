import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import axios from 'axios';
import genStyles from './genStyles';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

class TripConfirmScreen extends React.Component {

  onStartTrip = () => {
    const { userID, address, latitude, longitude } = this.props.navigation.state.params;
    const data = {
      destination_address: address,
      destination_latitude: latitude,
      destination_longitude: longitude
    };

    // posts a new Trip to API using data from Trip Search Screen
    // stores TRIP_ID in asyncstorage
    // can only be removed by trip cancellation or completion
    // not by navigating away from trip
    axios.post(`https://buddy-api-ada.herokuapp.com/users/${userID}/trips`, data)
      .then((response) => {
        console.log("successfully created: ", response.data);

        AsyncStorage.setItem('TRIP_ID', response.data.id.toString());

        this.props.navigation.navigate('MapScreen', {
          userID: userID,
          tripID: response.data.id,
          destination_address: address,
          destination_latitude: latitude,
          destination_longitude: longitude
        });
      })
      .catch((err) => {
        console.log("This is error " + err);
      });
}

  render() {
    const { address, latitude, longitude } = this.props.navigation.state.params;

    return (
      <View style={ genStyles.formScreen }>
        <View style={ genStyles.formContainer }>
          <Text style={ genStyles.searchResult }>{ address }</Text>
          <MapView
            provider={ "google" }
            style={ styles.map }
            showsUserLocation={ true }
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <Marker
              coordinate={{
                "latitude": latitude,
                "longitude": longitude
              }}
            />
          </MapView>
          <View style={ genStyles.buttonContainer }>
            <TouchableOpacity
              style={ genStyles.buttons }
              onPress={ this.onStartTrip }
            >
              <Text style={ genStyles.buttonText }>Start Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const screen = Dimensions.get('window');
const MAP_HEIGHT = screen.height * 0.5;
const ASPECT_RATIO = screen.width / MAP_HEIGHT;
const LATITUDE_DELTA = 0.0922 / 10;
const LONGITUDE_DELTA = (LATITUDE_DELTA * ASPECT_RATIO) / 10;

const styles = StyleSheet.create({
  map: {
    alignSelf: 'stretch',
    height: MAP_HEIGHT,
    borderColor: '#b7b7b7',
    borderWidth: 1,
    marginBottom: 20
  },
});



export default TripConfirmScreen;

