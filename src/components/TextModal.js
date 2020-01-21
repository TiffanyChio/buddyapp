import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import genStyles from './genStyles'

class TextModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      error: '',
    };
  }

  componentDidMount() {
    const { value } = this.props.navigation.state.params;
    this.setState({ value });
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  saveToAPI = async () => {
    const { rootURL, addURL, key, onUpdateCallback } = this.props.navigation.state.params;
    let id = null;

    if ("id" in this.props.navigation.state.params) {
      id = this.props.navigation.state.params.id;
    }

    const data = {};
    data[key] = this.state.value;

    axios.patch(`${rootURL}${addURL}`, data)
      .then((response) => {
        onUpdateCallback(key, this.state.value, id);
        this.props.navigation.goBack()
      })
      .catch((err) => {
        this.setState({
          error: err.response.data["error"]
        });
      });

  }

  render() {
    const { displayKey } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        { this.state.error.length > 0 ? <Text style={styles.error}>{ this.state.error }</Text> : <Text></Text> }
        <Text style={styles.label}>{ displayKey }:</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor='#d3d3d3'
          onChangeText={val => this.onChangeText('value', val)}
          value={ this.state.value }
        />
        <View style={genStyles.buttonContainer}>
          <TouchableOpacity
            style={genStyles.buttons}
            onPress={this.saveToAPI}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  error: {
    color: 'red',
  },
  label: {
    color: '#374548',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 17,
    fontWeight: '500',
    height: 55,
    borderWidth: 1,
    borderColor: '#70b800',
    margin: 20,
    color: '#374548',
    padding: 8,
  },
});

export default TextModal;
