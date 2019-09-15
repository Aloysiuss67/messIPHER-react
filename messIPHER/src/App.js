import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import Loading from './Loading'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import FindFriends from './FindFriends'
import ViewMessage from './ViewMessage'
import Settings from './Settings'
import ResetPass from './ResetPass'

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Chats',
            gesturesEnabled: false,
        },
    },
    FindFriends: {
        screen: FindFriends,
        navigationOptions: {
            title: 'Find Friends',
        },
    },
    ViewMessage: {
        screen: ViewMessage,
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            title: 'Settings',
        },
    },
    Loading: {
        screen: Loading,
    },
    Register: {
        screen: Register,
        navigationOptions: {
            title: 'Register',
        },
    },
    ResetPass: {
        screen: ResetPass,
        navigationOptions: {
            title: 'Reset Password',
        },
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
