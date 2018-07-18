/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import { Navigation } from "react-native-navigation";

import { registerScreens } from "./app/Screens";

registerScreens(Navigation);

export default class App extends Component{
  constructor() {
    this.startApp()
     
  }
  startApp=()=>{
    Navigation.startSingleScreenApp({
      screen: {
        screen: "LoginScreen",
        title: "Login",
        navigatorStyle: {}
      },
    });
  }
  // render() {
  //   return (
  //     <View style={styles.container}>
  //      {/* <Login/> */}
  //      <Text>Hello</Text> 
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
