import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

class TripCompleteModal extends React.Component {
  render() {
    return (
      <View style={ styles.container }>
        <Image style={ styles.img } source={ require('../assets/SuccessGreen.png') } />
        <Text style={ styles.announcement }>Trip Complete!</Text>
        <TouchableOpacity
          style={ styles.button }
          onPress={() => { this.props.navigation.navigate('MainMenu', {
            userID: this.props.navigation.state.params.userID
          })}}
        >
          <Text style={ styles.buttontext }>REURN TO THE MAIN MENU</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#333F48',
  },
  img: {
    marginBottom: 50,
  },
  announcement: {
    fontSize: 55,
    fontWeight: '200',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    padding: 10,
    backgroundColor: '#d1d9dc',
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttontext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333F48'
  },
});

export default TripCompleteModal;
