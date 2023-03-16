import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  allowsRecordingIOS: false,
});

let imgSource = require('./assets/audio-record-icon-1.png');

const Tab = createBottomTabNavigator();

export default class SoundBoard extends Component {

  /*
                        Ideas for Assign4:
  ------------------------------------------------------------------------
    Create a default buttonGrad class for both recording and sounds,
  and call them all on one render instead of rendering all the buttonGrads 
  individually. Use callbacks to identify the buttonGrad that is pressed
  
    Load sounds on ComponentDidMount(), use example from expo/sounds/
  to configure hold to record, press to play.
  */

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="SoundScreen" component={SoundPage}/>
            <Tab.Screen name="RecordScreen" component={RecordPage}/>
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}

class SoundPage extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.container}>

      
        <Text>Click a Button to play a sound!</Text>
        <View style={styles.hContainer}>
        <Funnybutton name={'Brrap'} soundFile={require('./assets/sfx/brrap.mp3')}/>
        <Funnybutton name={'Fart'}soundFile={require('./assets/sfx/fart.mp3')}/>
        </View>

        <View style={styles.hContainer}>
        <Funnybutton name={'Auughh'} soundFile={require('./assets/sfx/aughh.mp3')}/>
        <Funnybutton name={'Vine Boom'} soundFile={require('./assets/sfx/vineboom.mp3')}/>
        </View>

        <View style={styles.hContainer}>
        <Funnybutton name={'Extremely Loud Incorrect Buzzer Noise'} soundFile={require('./assets/sfx/incorrect-buzzer.mp3')}/>
        <Funnybutton name={'HEHEHEHA'} soundFile={require('./assets/sfx/heheheha.mp3')}/>
        </View>

      </View>
    );
  }
}

class Funnybutton extends Component {
  constructor(props){
    super(props);
    this.state = {
      localSound: undefined,
    }
  }

    //state handler
    setLocalSound = async (newPbo) => {
      this.setState({
        localSound: newPbo,
      });
    }
  
    async componentDidMount() {
      const { sound } = await Audio.Sound.createAsync(
        this.props.soundFile,
      );
      this.setLocalSound(sound);
    }
  
    async componentWillUnmount() {
      const { localSound } = this.state;
      if (localSound) {
        localSound.stopAsync();
        localSound.unloadAsync();
      }
    }
  
    playLocalSound = async () => {
      const { localSound } = this.state;
      await localSound.replayAsync();
    }

  render() {
    return(
      <View style={styles.container}>
      <TouchableOpacity onPress={this.playLocalSound}>
      <View style={styles.buttonParent}>
        <LinearGradient colors={['#19e312', '#12e396']} style={styles.buttonGrad}>
          <Text style={styles.buttonText}>{this.props.name}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
    </View>
    )
  }
}

class RecordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.hContainer}>
        <RecordButton/>
        <RecordButton/>
        </View>

        <View style={styles.hContainer}>
        <RecordButton/>
        <RecordButton/>
        </View>

      </View>
    );
  }
}

class RecordButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      localSound: null,
      recordedSound: null,
      recording: undefined,
    }
  }

    //state handler
    setLocalSound = async (newPbo) => {
      this.setState({
        localSound: newPbo,
      });
    }

    loadLocalUri = async (source) => {
      const { sound } = await Audio.Sound.createAsync({
        uri: source,
      })
      this.setLocalSound(sound);
    }
  
    async componentDidMount() {

    }
  
    async componentWillUnmount() {
      const { localSound } = this.state;
      if (localSound) {
        localSound.stopAsync();
        localSound.unloadAsync();
      }
    }
  
    playLocalSound = async () => {
      const { localSound } = this.state;
      try{      
        await localSound.replayAsync();
      } catch(error){
        console.log("Error: ", error)
      }

    }

    startRecording = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
        });
  
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  
        this.setState({ recording: recording });
      } catch (err) {
        console.error('Failed to start ', err);
      }
      console.log('recording...');
    }
  
    stopRecording = async () => {
      const { recording } = this.state;
      console.log('Stopping Recording...');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      this.setState({
        recording: undefined,
        recordedSound: uri,
      });
      console.log('Recording stopped and stored at ', uri);
      try {
        await this.loadLocalUri(this.state.recordedSound);
        console.log('Attatched ', uri, ' to the local sound');
      } catch (err) {
        console.log('FAILED TO ATTACH ', uri);
      }
    }

  render() {
    return(
      <View style={styles.container}>
      <TouchableOpacity onLongPress={this.startRecording} onPressOut={this.state.recording ? this.stopRecording : this.playLocalSound} onPress={this.playLocalSound}>
      <View style={styles.buttonParent}>
        <LinearGradient colors={this.state.recording ? ['#e31212', '#e31212'] : ['#EE0000', '#FF8800']} style={styles.buttonGrad}>
          <Text style={styles.buttonText}>{this.state.localSound ? "Press to Play!" : "Hold to Record!"}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
    </View>
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 15,
  },
  buttonGrad: {
    height: 100,
    width: 100,
    borderRadius: 10,
    left: 3,
    bottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },

  buttonParent: {
    height: 102,
    width: 102,
    borderRadius: 10,
    backgroundColor: 'black',
  },

  buttonText: {
    textAlign: 'center',
  },

  image: {
    width: 30,
    height: 30,
  },
});
