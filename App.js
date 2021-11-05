import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from 'firebase/auth'
import { View, Text } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

import LandingScreen from "./components/auth/Landing"
import RegisterScreen from "./components/auth/Register"
import LoginScreen from "./components/auth/Login"
import MainScreen from "./components/Main"
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'


const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyB55pNhYyLEDG8h2_t-x8so05IZSssT-W8",
  authDomain: "instagramclone-3a12e.firebaseapp.com",
  projectId: "instagramclone-3a12e",
  storageBucket: "instagramclone-3a12e.appspot.com",
  messagingSenderId: "990027172039",
  appId: "1:990027172039:web:5db6b83759d9319a0356e2",
  measurementId: "G-SYL2HRL8X7"
};

if (firebaseApp.getApps().length === 0) {
  firebaseApp.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    const auth = firebaseAuth.getAuth();
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state
    if (!loaded) {
      return (
        <View style ={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    }
    
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="InstaClone" component={LandingScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="InstaClone" component={MainScreen} />
            <Stack.Screen name="Add Image" component={AddScreen} navigation={this.props.navigation} />
            <Stack.Screen name="Save Post" component={SaveScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App
