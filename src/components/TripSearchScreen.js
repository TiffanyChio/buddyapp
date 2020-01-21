import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import { GEO_KEY } from 'react-native-dotenv';
import genStyles from './genStyles';

// constants used by form generator
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

class TripSearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      latitude: null,
      longitude: null,
      error: ''
    };
  }

  static navigationOptions = {
    title: 'Search'
  }

  onFormSubmit = async () => {
    const userInput = this._form.getValue();
    const userInputConcat = userInput.address.split(" ").join('+');

    // Google Maps geocoding API - not free
    const concatURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userInputConcat + "&key=" + GEO_KEY;

    // Simplified to only proceeds with the first hit
    axios.get(concatURL)
      .then((response) => {
        this.props.navigation.navigate('TripConfirm', {
          userID: this.props.navigation.state.params.userID,
          address: response.data.results[0]["formatted_address"],
          latitude: response.data.results[0]["geometry"]["location"]["lat"],
          longitude: response.data.results[0]["geometry"]["location"]["lng"]
        });
      })
      .catch((err) => {
        console.log("This is error " + err.response.data);
        this.setState({
          error: "No results found. Please modify your search and try again."
        })
      });
  }

  render() {
    return (
      <View style={ genStyles.formScreen }>
        { this.state.error.length > 0 ? <Text style={{color: 'red'}}>{ this.state.error }</Text> : <Text></Text> }
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
    </View>
    )
  }
}

export default TripSearchScreen;

