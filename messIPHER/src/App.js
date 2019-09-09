import React from 'react';
import { createAppContainer, StackActions, NavigationActions, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import { createStackNavigator} from 'react-navigation-stack';
import Loading from './Loading'
import Register from './Register'
import Login from './Login'
import Home from './Home'

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Chats',
            headerLeft: null,
            gesturesEnabled: false,
        },
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
