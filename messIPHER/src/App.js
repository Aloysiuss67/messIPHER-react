import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
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
