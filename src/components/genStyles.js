import React from 'react';
import { StyleSheet } from 'react-native';


const genStyles = StyleSheet.create({
  formScreen: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#32CD32',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttons: {
    backgroundColor: '#9d9c9a',
    borderRadius: 14,
    marginHorizontal: 5,
    paddingVertical: 12,
    paddingHorizontal: 25
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  searchResult: {
    fontSize: 20,
    paddingBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#36454f',
  },
  label: {
    padding: 10,
    margin: 5,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#70b800'
  },
  textLeft: {
    fontSize: 18,
    lineHeight: 18,
    alignSelf:'center',
    color: '#374548'
  },
  textRight: {
    fontSize: 24,
    lineHeight: 18,
    textAlign: 'right',
    alignSelf:'center',
    color: '#70b800'
  }
});

export default genStyles;

