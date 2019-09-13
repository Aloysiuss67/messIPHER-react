import React from 'react';
import { createAppContainer, StackActions, NavigationActions, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import { createStackNavigator} from 'react-navigation-stack';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import Loading from './Loading'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import FindFriends from './FindFriends'
import ViewMessage from './ViewMessage';

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Chats',
            headerLeft: null,
            gesturesEnabled: false,
        },
    },
    FindFriends: {
        screen: FindFriends,
    },
    ViewMessage: {
        screen: ViewMessage,
    },
    Loading: {
        screen: Loading,
    },
    Register: {
        screen: Register,
    },
    Login: {
        screen: Login,
        navigationOptions: {
            title: 'Login',
            headerLeft: null,
            gesturesEnabled: false,
        },
    }
}, {
    initialRouteName: 'Loading',
});

export default createAppContainer(AppNavigator);
