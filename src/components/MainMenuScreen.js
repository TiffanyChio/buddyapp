import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from 'axios';

class MainMenuScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      locationPermission: false,
      error: '',
    };
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };

  componentDidMount() {
    const { userID } = this.props.navigation.state.params;
    this.setState({ userID: userID });

    this.getLocationAsync();
  }

  // App needs 'ALWAYS' locations permission for geofence to work properly
  // see app.json for iOS permission set-up
  async getLocationAsync() {
    const status = await Permissions.askAsync(Permissions.LOCATION);
    console.log('status: ', status);

    if (status.status === 'granted') {
      this.setState(
        { locationPermission: true,
          error: '',
        });
      return;
    } else {
      this.setState({ error: 'Cannot access Trip or Check-In features without Location permission.' });
    }
  }

  // prior to creating a trip, checks persistent storage for existing trip
  // stored as TRIP_ID
  // if found, loads existing trip
  // else create a new trip
  onTripPress = async () => {
    try {
      const tripID = await AsyncStorage.getItem('TRIP_ID');

      if (tripID) {
        axios.get(`https://buddy-api-ada.herokuapp.com/trips/${tripID}`)
          .then((response) => {
            this.props.navigation.navigate('MapScreen', {
              userID: this.state.userID,
              tripID: tripID,
              destination_address: response.data.destination_address,
              destination_latitude: response.data.destination_latitude,
              destination_longitude: response.data.destination_longitude
            });
          })
          .catch((err) => {
            console.log("This is error " + err);
          });
      } else {
        this.props.navigation.navigate('TripSearch', { userID: this.state.userID });
      }
    } catch (err) {
      console.log('Could not retrieve tripID from AsyncStorage: ', err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{ this.state.error }</Text>
        <View style={ styles.header }>
          <Text style={ styles.subLine }>__Stay Safe</Text>
          <Text style={ styles.appName }>Buddy</Text>
        </View>
        <View style={ styles.iconsContainer }>
          <View style={ styles.iconsRowTop }>
            <TouchableOpacity
              style={ styles.sectionsLeft }
              disabled={ !this.state.locationPermission }
              onPress={ this.onTripPress }
            >
              <Image style={styles.icon} source={require('../assets/TripDark.png')} />
              <Text style={styles.text}> Start a New Trip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sections}
              disabled={ !this.state.locationPermission }
              onPress={() => { this.props.navigation.navigate('CheckInMode', {
                userID: this.state.userID });
              }}
            >
              <Image style={styles.icon} source={require('../assets/CheckInDark.png')} />
              <Text style={styles.text}> Check-In Mode </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.iconsRow}>
            <TouchableOpacity
              style={styles.sectionsLeft}
              onPress={() => { this.props.navigation.navigate('ContactsIndex', {
                userID: this.state.userID });
              }}
            >
              <Image style={styles.icon} source={require('../assets/ContactsDark.png')} />
              <Text style={styles.text}> Emergency Contacts </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sections}
              onPress={() => { this.props.navigation.navigate('UserProfile', {
                userID: this.state.userID });
              }}
            >
              <Image style={styles.icon} source={require('../assets/UserProfileDark.png')} />
              <Text style={styles.text}> User Profile </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    paddingTop: 150,
  },
  subLine: {
    fontSize: 20,
    fontFamily: 'Helvetica Neue',
    color: '#32CD32',
    textAlign: 'center',
  },
  appName: {
    fontSize: 100,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textAlign: 'center',
  },
  iconsContainer: {
    marginTop: 40
  },
  iconsRow: {
    flexDirection: 'row',
    paddingVertical: 30,
    marginHorizontal: 20,
  },
  iconsRowTop: {
    flexDirection: 'row',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#70b800'
  },
  icon: {
    marginVertical: 10
  },
  sections: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionsLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#70b800'
  },
  text: {
    fontSize: 16,
    fontFamily: 'Helvetica',
  }
})

export default MainMenuScreen;
