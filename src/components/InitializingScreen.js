import React from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import t from 'tcomb-form-native';

t.form.Form.stylesheet.textbox.normal.color = '#374548';
t.form.Form.stylesheet.textbox.normal.borderRadius = 0;
t.form.Form.stylesheet.textbox.error.borderRadius = 0;
t.form.Form.stylesheet.textbox.normal.borderColor = '#0e3251';
t.form.Form.stylesheet.controlLabel.normal.color = '#374548';
t.form.Form.stylesheet.controlLabel.normal.fontWeight = 'bold';
t.form.Form.stylesheet.controlLabel.error.fontWeight = 'bold';

class InitializingScreen extends React.Component {
  componentDidMount() {
    this.retrieveData()
  }

  // looks for BUDDY_ID in persistent storage
  // if found redirects to main menu, else redirects to sign-in
  retrieveData = async () => {
    try {
      const userID = await AsyncStorage.getItem('BUDDY_ID');

      if (userID) {
        this.props.navigation.navigate('MainMenu', { userID: userID });
      } else {
        this.props.navigation.navigate('SignIn');
      }
    } catch (err) {
      console.log('Could not retrieve buddy userID from AsyncStorage: ', err)
      this.props.navigation.navigate('SignIn');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 28
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default InitializingScreen;
