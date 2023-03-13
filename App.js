import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  allowsRecordingIOS: true,
});

let imgSource = require('./assets/audio-record-icon-1.png');

export default class SoundButton extends Component {

/*
                      Ideas for Assign4:
------------------------------------------------------------------------
  Create a default buttonGrad class for both recording and sounds,
and call them all on one render instead of rendering all the buttonGrads 
individually. Use callbacks to identify the buttonGrad that is pressed

  Load sounds on ComponentDidMount(), use example from expo/sounds/
to configure hold to record, press to play.
*/

constructor(props){
  super(props);
  this.state ={
    localSound: null,
    remoteSound: null,
    recordedSound: null,
    recording: undefined,
    remotePaused: false,
    remotePlaying: false,
  }
}

//state handler
setLocalSound(newPbo){
  this.setState({
    localSound: newPbo,
  });
}

setRemoteSound(remotePbo){
  this.setState({
    remoteSound: remotePbo,
  })
}

loadLocalUri = async (source) => {
  const { sound } = await Audio.Sound.createAsync({
    uri: source,
  })
  this.setLocalSound(sound);
}

async componentDidMount(){
  const { sound } = await Audio.Sound.createAsync(
    require("./assets/sfx/incorrect-buzzer.mp3"),
  );
  this.setLocalSound(sound);
}

async componentWillUnmount(){
  const { localSound } = this.state;
  if(localSound){
    localSound.stopAsync();
    localSound.unloadAsync();
  }
}

playLocalSound = async () => {
  const { localSound } = this.state;
  await localSound.replayAsync();
}

playRemoteSound = async () => {
  if(!this.state.remotePlaying){
  const { sound } = await Audio.Sound.createAsync({
    uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  });

  this.setRemoteSound(sound);
  await sound.playAsync();
  this.setState({remotePlaying: true,})
  } else {
    this.stopSound();
    this.setState({remotePlaying: false,})
  }
}

playPause = async () => {
  const { remoteSound, remotePaused } = this.state;
  if(!remotePaused){
    await remoteSound.pauseAsync();
  } else {
    await remoteSound.playAsync();
  }
  this.setState({ remotePaused: !remotePaused });
}

stopSound = async () => {
  const { remoteSound } = this.state;
  await remoteSound.stopAsync();
  await remoteSound.unloadAsync();
  this.setState({ remotePaused: false });
}

startRecording = async () => {
  try {
    await Audio.requestPermissionsAsync();
    // await Audio.setAudioModeAsync({
    //   allowsRecordingIOS: true,
    // })

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
  // await Audio.setAudioModeAsync({
  //   allowsRecordingIOS: false,
  // });
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

render(){
return (
  <View style={styles.container}>

  
    <Text>Click a buttonGrad to play a sound!</Text>
    <TouchableOpacity onPress={this.playLocalSound}>
        <View style={styles.buttonParent}>
          <LinearGradient colors={['#EE0000', '#FF8800']} style={styles.buttonGrad}>
            <Text>Click Me!</Text>
          </LinearGradient>
        </View>
    </TouchableOpacity>

    <TouchableOpacity onLongPress={this.startRecording} onPressOut={this.state.recording? this.stopRecording: this.playLocalSound} onPress={this.playLocalSound}>
      <View style={styles.buttonParent}>
          <LinearGradient colors={['#EE0000', '#FF8800']} style={styles.buttonGrad}>
        <Text>{this.state.recording? "Stop Recording!" : "Start Recording!"}</Text>
          </LinearGradient>
      </View>
    </TouchableOpacity>

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
hContainer: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
buttonGrad: {
  width: 150,
  height: 100,
  margin: 5,
  borderRadius: 10,
  padding:10,
  alignItems: 'center',
  justifyContent: 'center'
},

buttonParent: {
  height: 100,
  width: 100,
  borderRadius: 10,
},

image: {
  width: 30,
  height: 30,
},
});
