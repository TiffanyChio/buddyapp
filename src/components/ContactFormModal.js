import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import genStyles from './genStyles';

const Form = t.form.Form;

const Contact = t.struct({
  name: t.String,
  phone: t.Number,
  email: t.String
});

const options = {
  fields: {
    name: {
      autoCorrect: false,
    },
    phone: {
      label: 'Phone Number',
    },
    email: {
      autoCapitalize: 'none',
    }
  },
};

class ContactFormModal extends React.Component {
  handleSubmit = async () => {
    const { rootURL, addURL, onCreatedCallback } = this.props.navigation.state.params;

    // use that ref to get the form value
    const value = this._form.getValue();

    axios.post(`${rootURL}${addURL}`, value)
      .then((response) => {
        onCreatedCallback(response.data);
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log("This is error " + err.response.status + " " + err.response.data["error"]);
      });
  }

  render() {
    return (
      <View style={ genStyles.formScreen }>
        <View style={ genStyles.formContainer }>
          <Form
            ref={c => this._form = c} // assign a ref
            type={Contact}
            options={options}
          />
          <View style={genStyles.buttonContainer}>
            <TouchableOpacity
              style={genStyles.buttons}
              onPress={this.handleSubmit}
            >
              <Text style={genStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={genStyles.buttons}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={genStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ContactFormModal;

