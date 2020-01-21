import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import { GEO_KEY } from 'react-native-dotenv'
import genStyles from './genStyles'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const Form = t.form.Form;

const SignificantLocation = t.struct({
  address: t.String,
});

const options = {
  fields: {
    address: {
      autoCapitalize: 'none',
      autoCorrect: false,
      label: 'Enter an Address'
    }
  },
};

class SLocationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      latitude: null,
      longitude: null,
      error: ''
    };
  }

  // Google Maps geocoding API - not free
  onFormSubmit = async () => {
    const userInput = this._form.getValue();
    const userInputConcat = userInput.address.split(" ").join('+');

    const concatURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userInputConcat + "&key=" + GEO_KEY;

    // Simplified to only proceeds with the first hit
    axios.get(concatURL)
      .then((response) => {
        this.setState({
          address: response.data.results[0]["formatted_address"],
          latitude: response.data.results[0]["geometry"]["location"]["lat"],
          longitude: response.data.results[0]["geometry"]["location"]["lng"],
          error: "",
        });
      })
      .catch((err) => {
        console.log("Could not get geocode: " + err.response.data);
        this.setState({
          error: "No results found. Please modify your search and try again."
        })
      });
  }

  onSave = () => {
    const { rootURL, addURL, onCreatedCallback } = this.props.navigation.state.params;

    const data = {
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }

    axios.post(`${rootURL}${addURL}`, data)
      .then((response) => {
        console.log("successfully created: ", response.data);
        onCreatedCallback(response.data);
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log("This is error " + err.response.data);
      });
  }

  // modal uses ternary to conditionally render either the form or the results
  render() {
    return (
      <View style={ genStyles.formScreen }>
        { this.state.error.length > 0 ? <Text style={ styles.error }>{ this.state.error }</Text> : <Text></Text> }
        { this.state.address.length === 0 ?
          <View style={ genStyles.formContainer }>
            <Form
              ref={ c => this._form = c }
              type={ SignificantLocation }
              options={ options }
            />
            <View style={ genStyles.buttonContainer }>
              <TouchableOpacity
                style={ genStyles.buttons }
                onPress={ this.onFormSubmit }
              >
                <Text style={ genStyles.buttonText }>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={ genStyles.buttons }
                onPress={ () => this.props.navigation.goBack() }
              >
                <Text style={ genStyles.buttonText }>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View style={ genStyles.formContainer }>
            <View style={ styles.resultContainer }>
              <Text style={ genStyles.searchResult }>{ this.state.address }</Text>
            </View>
            <MapView
              provider={"google"}
              style={styles.map}
              showsUserLocation={true}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
            >
              <Marker
                coordinate={{
                  "latitude": this.state.latitude,
                  "longitude": this.state.longitude
                }}
              />
            </MapView>
            <View style={ genStyles.buttonContainer }>
              <TouchableOpacity
                style={ genStyles.buttons }
                onPress={ this.onSave }
              >
                <Text style={ genStyles.buttonText }>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={ genStyles.buttons }
                onPress={ () => this.props.navigation.goBack() }
              >
                <Text style={ genStyles.buttonText }>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
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
  resultContainer: {
    paddingVertical: 15,
  },
  map: {
    alignSelf: 'stretch',
    height: MAP_HEIGHT,
    borderColor: '#b7b7b7',
    borderWidth: 1,
    marginBottom: 20
  },
});

export default SLocationModal;

