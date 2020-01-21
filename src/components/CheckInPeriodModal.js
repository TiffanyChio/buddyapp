import React from 'react';
import { Text, View, TouchableOpacity, Picker } from 'react-native';
import axios from 'axios';
import genStyles from './genStyles'


class CheckInPeriodModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkInPeriod: null,
      error: '',
    };
  }

  componentDidMount() {
    const { checkInPeriod } = this.props.navigation.state.params;
    this.setState({ checkInPeriod });
  }

  onSave = () => {
    const { rootURL, addURL, onCheckInPeriodCallback } = this.props.navigation.state.params;

    const data = {
      check_in_period: this.state.checkInPeriod
    }

    axios.patch(`${rootURL}${addURL}`, data)
      .then((response) => {
        onCheckInPeriodCallback(this.state.checkInPeriod);
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log("This is error " + err.response.data);
      });

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Picker
            selectedValue={ this.state.checkInPeriod }
            style={{ height: 50, width: 200 }}
            itemStyle={{ color: '#36454f', fontSize: 22 }}
            onValueChange={(itemValue) =>
              this.setState({checkInPeriod: itemValue})
            }
          >
            <Picker.Item label="24 (1 day)" value={24} />
            <Picker.Item label="48 (2 days)" value={48} />
            <Picker.Item label="72 (3 days)" value={72} />
            <Picker.Item label="96 (4 days)" value={96} />
            <Picker.Item label="120 (5 days)" value={120} />
            <Picker.Item label="144 (6 days)" value={144} />
            <Picker.Item label="168 (weekly)" value={168} />
          </Picker>
        </View>
        <View style={{ flex: 1 }}>
          <View style={ genStyles.buttonContainer }>
            <TouchableOpacity
              style={ genStyles.buttons }
              onPress={ this.onSave }
            >
              <Text style={ genStyles.buttonText }>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ genStyles.buttons }
              onPress={ () => this.props.navigation.goBack() }
            >
              <Text style={ genStyles.buttonText }>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default CheckInPeriodModal;
