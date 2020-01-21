import React from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import axios from 'axios';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
    };
  }

  static navigationOptions = {
    title: ''
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  signUp = async () => {
    const { username, email, password } = this.state;
    const data = {
      username: username,
      email: email,
      password: password
    };

    axios.post(`https://buddy-api-ada.herokuapp.com/users`, data)
      .then((response) => {
        const userID = response.data["id"];
        this.saveUserID(userID);
      })
      .catch((err) => {
        this.setState({
          password: '',
          error: err.response.data["message"]
        });
      });
  }

  // after signing up BUDDY_ID is stored in AsyncStorage
  // will bypass sign-in the next time the app is loaded
  saveUserID = async (userID) => {
    try {
      await AsyncStorage.setItem('BUDDY_ID', userID.toString());
      this.props.navigation.navigate('MainMenu', { userID: userID });
    } catch (err) {
      console.log("Could not save credentials to AsyncStorage: ", err);
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
      >
        { this.state.error.length > 0 ? <Text style={styles.error}>{ this.state.error }</Text> : <Text></Text> }
        <TextInput
          style={styles.input}
          placeholder='Full Name'
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor='#d3d3d3'
          onChangeText={val => this.onChangeText('username', val)}
          value={ this.state.username }
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor='#d3d3d3'
          onChangeText={val => this.onChangeText('email', val)}
          value={ this.state.email }
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          autoCapitalize="none"
          secureTextEntry={true}
          placeholderTextColor='#d3d3d3'
          onChangeText={val => this.onChangeText('password', val)}
          value={ this.state.password }
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this.signUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  logo: {
    width: 200,
    height: 200,
    marginVertical: 50
  },
  input: {
    width: 350,
    fontSize: 18,
    fontWeight: '500',
    height: 55,
    margin: 10,
    color: '#000000',
    padding: 8,
    marginBottom: 1,
    borderBottomColor: '#708090',
    borderBottomWidth: 1,
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: '#000000',
    margin: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: 'white'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SignUpScreen;
