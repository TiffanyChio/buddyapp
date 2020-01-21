import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, FlatList, Image } from 'react-native';
import axios from 'axios';
import ActionButton from 'react-native-action-button';
import Swipeable from 'react-native-swipeable-row';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import SLocationCard from './SLocationCard'

class CheckInModeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      checkInMode: null,
      checkInPeriod: null,
      sLocations: [],
      toggleError: ''
    };
  }

  static navigationOptions = {
    title: 'Check-In Mode'
  }

  componentDidMount() {
    const userID = this.props.navigation.state.params.userID;

    axios.get(`https://buddy-api-ada.herokuapp.com/users/${userID}`)
    .then((response) => {
      this.setState({
        userID: userID,
        checkInMode: response.data["check_in_mode"],
        checkInPeriod: response.data["check_in_period"],
        toggleError: ''
      });
    })
    .catch((error) => {
      console.log('Error getting user information', error.data);
    });

    axios.get(`https://buddy-api-ada.herokuapp.com/users/${userID}/slocations`)
    .then((response) => {
      this.setState({
        sLocations: response.data,
        toggleError: ''
      });
    })
    .catch((error) => {
      console.log('Error getting signification location information', error.data);
    });
  }

  // check-in mode can only be turned on if there is a saved check-in location
  // geofences around check-in locations are turned on or off
  toggleCheckInMode = async () => {
    if (!this.state.checkInMode && this.state.sLocations.length == 0) {
      this.setState({ toggleError: "Cannot turn on Check-In Mode without saved Check-In Locations."});
      return
    }

    const regions = this.state.sLocations.map((location) => {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 50
      }
    });

    if (this.state.checkInMode) {
      await Location.stopGeofencingAsync("CROSSING_SLOCATION")
      .then((response) => {
        console.log('turned off check in mode');
      })
      .catch((error) => {
        console.log('failed to turn off check in mode', error);
        return;
      });
    } else {
      await Location.startGeofencingAsync("CROSSING_SLOCATION", regions)
      .then((response) => {
        console.log('turned on check in mode');
      })
      .catch((error) => {
        console.log('failed to turn on check in mode', error);
        return;
      });
    }

    axios.patch(`https://buddy-api-ada.herokuapp.com/users/${this.state.userID}/togglecheckin`)
      .then((response) => {
        this.setState({
          checkInMode: !this.state.checkInMode,
          toggleError: ''
        })
      })
      .catch((err) => {
        this.setState({
          error: err.response.data["error"]
        });
      });
  }

  // geofences are also created if new check-in location added and
  // check-in mode is on
  onCreatedCallback = (newLocation) => {
    const sLocations = this.state.sLocations;
    sLocations.unshift(newLocation);
    this.setState({
      sLocations: sLocations,
      toggleError: ''
    });

    if (this.state.checkInMode) {
      const regions = this.state.sLocations.map((location) => {
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 50
        }
      });

      Location.startGeofencingAsync("CROSSING_SLOCATION", regions)
      .then((response) => {
        console.log('turned on async');
        console.log(response);
      })
      .catch((error) => {
        console.log('failed to turn on async');
        return;
      });
    }
  }

  addNewSLocation = () => {
    this.props.navigation.navigate('SLocationModal', {
      rootURL: 'https://buddy-api-ada.herokuapp.com/',
      addURL: `users/${ this.state.userID }/slocations`,
      onCreatedCallback: this.onCreatedCallback
    });
  }

  // check-in period is defaulted to 24 hours
  changeCheckInPeriod = () => {
    this.props.navigation.navigate('CheckInPeriodModal', {
      checkInPeriod: this.state.checkInPeriod,
      onCheckInPeriodCallback: this.onCheckInPeriodCallback,
      rootURL: 'https://buddy-api-ada.herokuapp.com/',
      addURL: `users/${ this.state.userID }`
    });
  }

  onCheckInPeriodCallback = (newTime) => {
    this.setState({ checkInPeriod: newTime });
  }

  // if a check-in location is deleted and check-in mode is on
  // geofence function need to be reset by remapping all slocation
  // minus the deleted one
  onDeleteCallback = (id) => {
    const sLocations = this.state.sLocations.filter((element) => element.id !== id);
    this.setState({ sLocations });

    if (this.state.checkInMode) {
      const regions = this.state.sLocations.map((location) => {
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 50
        }
      });

      Location.startGeofencingAsync("CROSSING_SLOCATION", regions)
      .then((response) => {
        console.log('turned on async');
      })
      .catch((error) => {
        console.log('failed to turn on async');
        return;
      });
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <Image source={ require('../assets/HomeSecure2.png') } />
          <Text style={ styles.headerText }>
            Send an alert to your emergency contacts if you don't return home with Check-In Mode.
          </Text>
        </View>
        <View style={ styles.section }>
          { this.state.toggleError.length > 0 ? <Text style={{ color: "red" }}>{ this.state.toggleError }</Text> : <Text></Text> }
          <Text style={ styles.text }>Check-In Mode is currently { this.state.checkInMode ? "on." : "off." }</Text>
          <Switch
            style={{ marginTop:5, marginHorizontal: 25 }}
            trackColor={{true: '#32CD32', false: null}}
            onValueChange = { this.toggleCheckInMode }
            value = { this.state.checkInMode }
          />
        </View>
        <View style={ styles.section }>
          <Text style={ styles.text }>Check-In Period
            <Text style={ styles.textsmall }> (time between check-ins):</Text>
          </Text>
          <TouchableOpacity
            style={ styles.button }
            onPress={ this.changeCheckInPeriod }
          >
            <Text style={ styles.buttontext }>{ this.state.checkInPeriod } Hours</Text>
          </TouchableOpacity>
        </View>
        <View style={ styles.locationSection }>
          <Text style={ styles.textHeading }>Check-In Locations</Text>
          <FlatList
            data={this.state.sLocations}
            renderItem={({item}) => <SLocationCard
              key={ item.id }
              id={ item.id }
              address={ item.address }
              onDeleteCallback={ this.onDeleteCallback }
            />}
            keyExtractor={ item => item.id.toString() }
          />
        </View>
        <ActionButton
          buttonColor="rgba(112, 184, 0, 1)"
          position="center"
          onPress={ this.addNewSLocation }
        >
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF'
  },
  header: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
    flexShrink: 1,
    alignSelf: 'flex-end',
    color: '#374548'
  },
  section: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d9dc'
  },
  text: {
    fontSize: 18,
    paddingBottom: 8,
    color: '#374548',
  },
  textsmall: {
    fontSize: 14,
    paddingBottom: 8,
  },
  button: {
    height: 36,
    backgroundColor: '#70b800',
    borderColor: '#70b800',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  buttontext: {
    fontSize: 16,
    textAlign: "center",
    color: 'white',
  },
  locationSection: {
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d9dc',
    paddingVertical: 30,
    backgroundColor: "#d1d9dc",
    marginBottom: 10,
    flex:1,
  },
  textHeading: {
    fontSize: 20,
    paddingBottom: 8,
    paddingHorizontal: 10,
    color: '#374548',
  },
});

export default CheckInModeScreen
