import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import genStyles from './genStyles'

class ViewContactScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      phoneNumber: null,
      email: '',
    };
  }

  static navigationOptions = {
    title: ""
  }

  componentDidMount() {
    const { name, phoneNumber, email } = this.props.navigation.state.params;

    this.setState({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
    });
  }

  onUpdateCallbackMed = (key, value, id) => {
    const { onUpdateCallback } = this.props.navigation.state.params;
    this.setState({ [key]: value} );
    onUpdateCallback(key, value, id);
  }

  onDelete = async () => {
    const { id, onDeleteCallback } = this.props.navigation.state.params;

    axios.delete(`https://buddy-api-ada.herokuapp.com/contacts/${ id }`)
      .then((response) => {
        this.props.navigation.navigate('ContactsIndex', {
          userID: this.state.userID
        });
        onDeleteCallback(id);
      })
      .catch((error) => {
        console.log("Could not delete contact: ", error.data["message"]);
      });
  }

  render() {
    const { id } = this.props.navigation.state.params;

    return (
      <View style={ styles.container }>
        <TouchableOpacity
          style={ genStyles.label }
          onPress={() => this.props.navigation.navigate('TextModal', {
            rootURL: 'https://buddy-api-ada.herokuapp.com/',
            addURL: `contacts/${ id }`,
            displayKey: 'Name',
            key: 'name',
            value: this.state.name,
            id: id,
            onUpdateCallback: this.onUpdateCallbackMed
          })}
        >
          <Text style={ genStyles.textLeft }> NAME: { this.state.name }</Text>
          <Text style={ genStyles.textRight }> > </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ genStyles.label }
          onPress={() => this.props.navigation.navigate('TextModal', {
            rootURL: 'https://buddy-api-ada.herokuapp.com/',
            addURL: `contacts/${ id }`,
            displayKey: 'Phone Number',
            key: 'phoneNumber',
            value: this.state.phoneNumber.toString(),
            id: id,
            onUpdateCallback: this.onUpdateCallbackMed
          })}
        >
          <Text style={ genStyles.textLeft }>PHONE NUMBER: { this.state.phoneNumber }</Text>
          <Text style={ genStyles.textRight }> > </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ genStyles.label }
          onPress={() => this.props.navigation.navigate('TextModal', {
            rootURL: 'https://buddy-api-ada.herokuapp.com/',
            addURL: `contacts/${ id }`,
            displayKey: 'Email',
            key: 'email',
            value: this.state.email,
            id: id,
            onUpdateCallback: this.onUpdateCallbackMed
          })}
        >
          <Text style={ genStyles.textLeft }>EMAIL: { this.state.email }</Text>
          <Text style={ genStyles.textRight}> > </Text>
        </TouchableOpacity>
        <View style={ genStyles.buttonContainer }>
          <TouchableOpacity
            style={ genStyles.buttons }
            onPress={ this.onDelete }
          >
            <Text style={ genStyles.buttonText }>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF'
  }
});

export default ViewContactScreen;
