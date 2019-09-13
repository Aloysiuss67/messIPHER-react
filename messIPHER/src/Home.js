import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {updateFriends} from './services/firestoreService'
import {chatClientService} from './services/chatClientService';

export default class Main extends React.Component {
    state = {currentUser: null, search: ''};
    friends = [];
    chatkit = new chatClientService();

    avatar_url1 = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
    avatar_url2 = 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'

    list = [
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President',
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman',
        },
    ];


    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <Icon
                    reverse
                    name='ios-person-add'
                    type='ionicon'
                    color='#517aa4'
                    size={17}
                    onPress={() => navigation.navigate('FindFriends')} />
            ),
        };
    }



    componentDidMount() {
        const {currentUser} = firebase.auth();
        this.setState({currentUser});
        this.chatkit.connectToChat('ben@test.com')
        this.props.navigation.addListener("didFocus", () => {
            this.friends = updateFriends()
        })
    }

    updateSearch = search => {
        this.setState({search});
    };

    render() {
        const {currentUser, search} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Find your friends..."
                    onChangeText={this.updateSearch}
                    value={search}
                    platform={'ios'}
                />
                {
                    this.friends.map((l, i) => (
                        <ListItem
                            key={i}
                            //leftAvatar={{source: {uri: l.avatar_url}}}
                            title={l.username}
                            subtitle={l.email}
                            onPress={()=> this.props.navigation.navigate('ViewMessage')}
                            bottomDivider
                        />
                    ))
                }
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('FindFriends')}
                />
                <Button
                    title="Logout"
                    onPress={() => firebase.auth().signOut()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
