import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import axios from 'axios';

const SLocationCard = (props) => {
  const { id, address, onDeleteCallback } = props;

  const onDelete = async () => {
    axios.delete(`https://buddy-api-ada.herokuapp.com/slocations/${ id }`)
    .then((response) => {
      onDeleteCallback(id);
    })
    .catch((error) => {
      console.log('Could not delete significant location: ', error.data["message"]);
    });
  }

  const rightButton = [
    <TouchableOpacity
      style={ styles.deleteButton }
      key = { id }
      onPress={ onDelete }
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  ];

  return(
    <Swipeable rightButtons={ rightButton } key={ id }>
      <View style={ styles.locationContainer }>
        <Text style={ styles.textLocation }>{ address }</Text>
      </View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  locationContainer: {
    height: 80,
    backgroundColor: 'white',
    borderColor: '#b7b7b7',
    borderWidth: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textLocation: {
    fontSize: 16,
    paddingHorizontal: 15,
    color: '#0e3251'
  },
  deleteButton: {
    backgroundColor: '#561B1F',
    height: 80,
    marginBottom: 5,
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    paddingLeft: 10,
    color: 'white',
  }
});

export default SLocationCard;
