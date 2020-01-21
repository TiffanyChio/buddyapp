import React from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import ActionButton from 'react-native-action-button';
import ContactCard from './ContactCard';

class ContactsIndexScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      contacts: [],
      error: ''
    };
  }

  static navigationOptions = {
    title: 'Emergency Contacts'
  }

  componentDidMount() {
    const { userID } = this.props.navigation.state.params;

    axios.get(`https://buddy-api-ada.herokuapp.com/users/${userID}/contacts`)
      .then((response) => {
        this.setState({
          userID: userID,
          contacts: response.data.reverse(),
          error: ''
        });
      })
      .catch((error) => {
        this.setState({
          error: error.data["message"],
        });
      });
  }

  addNewContact = () => {
    this.props.navigation.navigate('ContactFormModal', {
      rootURL: 'https://buddy-api-ada.herokuapp.com/',
      addURL: `users/${ this.state.userID }/contacts`,
      onCreatedCallback: this.onCreatedCallback
    });
  }

  onCreatedCallback = (newContact) => {
    const contacts = this.state.contacts;
    contacts.unshift(newContact);
    this.setState({ contacts });
  }

  goToView = (name, phoneNumber, email, id) => {
    this.props.navigation.navigate('ViewContact', {
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      id: id,
      onUpdateCallback: this.onUpdateCallback,
      onDeleteCallback: this.onDeleteCallback
    });
  }

  onDeleteCallback = (id) => {
    const contacts = this.state.contacts.filter((element) => element.id !== id);
    this.setState({ contacts });
  }

  onUpdateCallback = (key, value, id) => {
    const contacts = this.state.contacts
    const contact = contacts.find(person => person.id === id);
    contact[key] = value;
    this.setState({ contacts });
  }

  render() {
    const contactList = this.state.contacts.map((person) => {
      return <ContactCard
        key = { person.id }
        name = { person.name }
        email = { person.email }
        phoneNumber = { person.phone }
        id = { person.id }
        goToView = { this.goToView }
      />
    });

    return(
      <View style={ styles.container }>
        { contactList }
        <ActionButton
          buttonColor="rgba(112, 184, 0, 1)"
          position="center"
          onPress={ this.addNewContact }
        >
        </ActionButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF'
  }
});

export default ContactsIndexScreen;
