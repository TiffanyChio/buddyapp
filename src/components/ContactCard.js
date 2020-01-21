import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ContactCard = (props) => {
  const { name, phoneNumber, email, id } = props;

  const phoneStr = phoneNumber.toString();
  const formattedPhone = "(" + phoneStr.slice(0, 3) + ") " + phoneStr.slice(3, 6) + "-" + phoneStr.slice(6, 10);

  return (
    <TouchableOpacity
      style={ styles.cardContainer }
      onPress={ () => { props.goToView(name, phoneNumber, email, id) } }
    >
      <View style={ styles.textContainer }>
        <Text style={ styles.textName }>{ name }</Text>
        <Text style={ styles.text }>{ formattedPhone }</Text>
        <Text style={ styles.text }>{ email }</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 150,
    borderColor: '#70b800',
    borderWidth: 1,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  textContainer: {
    height: 120,
    justifyContent: 'space-evenly',
    padding: 10
  },
  textName: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 22,
    color: '#374548'
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
    color: '#374548',
  }
});

export default ContactCard;
