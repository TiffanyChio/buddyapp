import React from 'react';
import { AsyncStorage } from 'react-native';
import { createAppContainer, NavigationEvents } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { YellowBox } from 'react-native';
import axios from 'axios';

import InitializingScreen from './src/components/InitializingScreen'
import SignInScreen from './src/components/SignInScreen'
import SignUpScreen from './src/components/SignUpScreen'
import MainMenuScreen from './src/components/MainMenuScreen'
import UserProfileScreen from './src/components/UserProfileScreen'
import TextModal from './src/components/TextModal'
import ContactsIndexScreen from './src/components/ContactsIndexScreen'
import ContactFormModal from './src/components/ContactFormModal'
import ViewContactScreen from './src/components/ViewContactScreen'
import CheckInModeScreen from './src/components/CheckInModeScreen'
import SLocationModal from './src/components/SLocationModal'
import CheckInPeriodModal from './src/components/CheckInPeriodModal'
import TripSearchScreen from './src/components/TripSearchScreen'
import TripConfirmScreen from './src/components/TripConfirmScreen'
import MapScreen from './src/components/MapScreen'
import TripCompleteModal from './src/components/TripCompleteModal'

console.disableYellowBox = true;

TaskManager.defineTask("CROSSING_SLOCATION", async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.log('CROSS SLOCATION GEOFENCE ERROR', error);
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter || eventType === Location.GeofencingEventType.Exit) {
    console.log("You've crossed slocation geofence:", region);

    const userID = await AsyncStorage.getItem('BUDDY_ID');

    const data = {
      last_check_in: Date.now()
    };

    axios.patch(`https://buddy-api-ada.herokuapp.com/users/${ userID }`, data)
      .then((response) => {
        console.log('Successfully updated last check in time: ', response.data);
      })
      .catch((err) => {
        console.log('Error updating last check in time', err);
      });
  }
});

TaskManager.defineTask("ARRIVE_AT_DEST", async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.log('ARRIVE AT DEST ERROR: ', error);
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("You've arrived at your destination", region);

    const tripID = await AsyncStorage.getItem('TRIP_ID');

    const data = {
      status: "COMPLETE"
    };

    axios.patch(`https://buddy-api-ada.herokuapp.com/trips/${ tripID }`, data)
      .then((response) => {
        console.log('Successfully updated trip status to COMPLETE: ', response.data);
        AsyncStorage.removeItem('TRIP_ID');
        Location.stopGeofencingAsync("ARRIVE_AT_DEST");
      })
      .catch((err) => {
        console.log('Error updating trip status to COMPLETE', err);
      });
  }
});

export default class App extends React.Component {
  render() {
    const MainStack = createStackNavigator(
      {
        Initializing: InitializingScreen,
        SignIn: SignInScreen,
        SignUp: SignUpScreen,
        MainMenu: MainMenuScreen,
        UserProfile: UserProfileScreen,
        ContactsIndex: ContactsIndexScreen,
        ViewContact: ViewContactScreen,
        CheckInMode: CheckInModeScreen,
        TripSearch: TripSearchScreen,
        TripConfirm: TripConfirmScreen,
        MapScreen: MapScreen
      },
      {
        initialRouteName: 'Initializing',
      }
    );

    const RootStack = createStackNavigator(
      {
        Main: {
          screen: MainStack,
        },
        TextModal: {
          screen: TextModal,
        },
        ContactFormModal: {
          screen: ContactFormModal,
        },
        SLocationModal: {
          screen: SLocationModal,
        },
        CheckInPeriodModal: {
          screen: CheckInPeriodModal,
        },
        TripCompleteModal: {
          screen: TripCompleteModal,
        }
      },
      {
        mode: 'modal',
        headerMode: 'none',
      }
    );

    const AppContainer = createAppContainer(RootStack);

    return <AppContainer />;
  }
}
