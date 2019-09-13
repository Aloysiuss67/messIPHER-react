import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {updateFriends} from './services/firestoreService'
import {chatClientService} from './services/chatClientService';

export default class Main extends React.Component {
    state = {currentUser: null, search: '', friends: []};
    // friends = [];
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
        this.props.navigation.addListener("didFocus", async () => {
            const user = firebase.auth().currentUser;
            //this.setState(currentUser = user);
            this.setState(() => {
                return { currentUser: user }
            })
            this.chatkit.connectToChat(user.email) // FIXME
            this.setState({friends: await updateFriends(user.email)})
        })
    }

    updateSearch = search => {
        this.setState({search: search});
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
                    this.state.friends.map((l, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={{source: {uri: this.avatar_url2}}}
                            title={l.username}
                            subtitle={l.email}
                            onPress={()=> this.props.navigation.navigate('ViewMessage')}
                            bottomDivider
                        />
                    ))
                }
                <Button
                    title="Logout"
                    onPress={() => {
                        this.setState({currentUser: null, friends: []})
                        firebase.auth().signOut()
                    }}
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
