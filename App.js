import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SoundButton extends Component {

  /*
                        Ideas for Assign4:
------------------------------------------------------------------------
    Create a default button class for both recording and sounds,
  and call them all on one render instead of rendering all the buttons 
  individually. Use callbacks to identify the button that is pressed

    Load sounds on ComponentDidMount(), use example from expo/sounds/
  to configure hold to record, press to play.
  */

  render(){
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
