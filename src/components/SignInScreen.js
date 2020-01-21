import React from 'react';
import { StyleSheet, Image, Text, KeyboardAvoidingView, Button, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import axios from 'axios';

class SignInScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  // after signing in BUDDY_ID is stored in AsyncStorage
  // will bypass sign-in the next time the app is loaded
  signIn = async () => {
    const { email, password } = this.state;
    console.log("before the try: ", email, password);

    try {
      const response = await axios.post(`https://buddy-api-ada.herokuapp.com/signin`, {}, {
        auth: {
          username: email,
          password: password
        }
      });

      let userID;
      try {
        userID = response.data["BUDDY_ID"];
        this.saveUserID(userID);
      } catch(err) {
        console.log("Could not save credentials to AsyncStorage: ", err);
      }

      this.setState({
        email: '',
        password: '',
        error: '',
      });

      this.props.navigation.navigate('MainMenu', { userID: userID });
    } catch(err) {
      console.log(err);
        this.setState({
          email: '',
          password: '',
          error: "Invalid email and password combination."
        });
    }
  }

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
        <Image style={styles.logo} source={require('../assets/buddyicon.png')} />
        { this.state.error.length > 0 ? <Text style={styles.error}>{ this.state.error }</Text> : <Text></Text> }
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
          onPress={this.signIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Button
          style={{color:'#9ba8ae', fontSize: 16}}
          color='#707a7e'
          title="Don't have an account? Sign up here."
          onPress={ () => { this.props.navigation.navigate('SignUp')} }
        />
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
    fontFamily: 'Helvetica',
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

export default SignInScreen;
