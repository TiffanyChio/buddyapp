import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import axios from 'axios';
import genStyles from './genStyles';

class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      username: '',
      email: '',
      error: ''
    };
  }

  static navigationOptions = {
    title: 'User Profile'
  }

  componentDidMount() {
    const { userID } = this.props.navigation.state.params;

    axios.get(`https://buddy-api-ada.herokuapp.com/users/${userID}`)
      .then((response) => {
        this.setState({
          userID: userID,
          username: response.data["username"],
          email: response.data["email"],
          error: ''
        });
      })
      .catch((error) => {
        this.setState({
          error: error.data["message"],
        });
      });
  }

  onUpdateCallback = (key, value, id) => {
    this.setState({ [key]: value} );
  }

  onLogout = () => {
    AsyncStorage.removeItem('BUDDY_ID');
    this.props.navigation.navigate('SignIn');
  }

  // logging out will removed BUDDY_ID from AsyncStorage
  // requiring that the user sign-in the next time the app loads
  render() {
    return(
      <View style={styles.container}>
        <TouchableOpacity
          style={genStyles.label}
          onPress={() => this.props.navigation.navigate('TextModal', {
            rootURL: 'https://buddy-api-ada.herokuapp.com/',
            addURL: `users/${ this.state.userID }`,
            displayKey: 'Name',
            key: 'username',
            value: this.state.username,
            onUpdateCallback: this.onUpdateCallback
          })}
        >
          <Text style={genStyles.textLeft}> NAME: {this.state.username}</Text>
          <Text style={genStyles.textRight}> > </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={genStyles.label}
          onPress={() => this.props.navigation.navigate('TextModal', {
            rootURL: 'https://buddy-api-ada.herokuapp.com/',
            addURL: `users/${ this.state.userID }`,
            displayKey: 'Email',
            key: 'email',
            value: this.state.email,
            onUpdateCallback: this.onUpdateCallback
          })}
        >
          <Text style={genStyles.textLeft}>EMAIL: {this.state.email}</Text>
          <Text style={genStyles.textRight}> > </Text>
        </TouchableOpacity>
        <Button title='Change Password' color='#000000' />
        <Button
          title='Log Out'
          color='#000000'
          onPress={ this.onLogout }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF'
  },
});

export default UserProfileScreen;
