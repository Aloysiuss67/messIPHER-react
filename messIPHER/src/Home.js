import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {updateFriends} from './services/firestoreService'
import {chatClientService} from './services/chatClientService';

export default class Main extends React.Component {
    state = {currentUser: null, search: '', friends: [], chat: null};

    chatkit = new chatClientService()


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
                    onPress={() => navigation.navigate('FindFriends', {
                        currentUserEmail : navigation.getParam('currentUserEmail')
                    })} />
            ),
            headerLeft: (
                <Icon
                    reverse
                    name='ios-settings'
                    type='ionicon'
                    color='#517aa4'
                    size={17}
                    onPress={() => navigation.navigate('Settings')} />
            ),
        };
    }



    componentDidMount() {
        // need to add listeners for auth change
        firebase.auth().onAuthStateChanged(async ()=> {
            console.log(this.props.navigation.getParam('currentUserEmail') + ' user details ')
            let userEmail = this.props.navigation.getParam('currentUserEmail');

            // if user it logged in, reset states
            if (userEmail != null) {
                this.setState({currentUser: userEmail})
                // create new chat kits and connect with this email
                this.chatkit = new chatClientService()
                this.chatkit.connectToChat(userEmail)
                // set state to contain reference to this chatkit
                this.setState({ chat: this.chatkit})
            }
        })

        // called every time this pages takes focus, need to reset friends list
        this.props.navigation.addListener("didFocus", async () => {
            let userEmail = this.props.navigation.getParam('currentUserEmail');
            this.setState({friends: await updateFriends(userEmail)})
        })
    }

    /**
     * Called every time the search bar has text entered into it.
     * @param search
     */
    updateSearch = search => {
        this.setState({search: search});
    }

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
                            onPress={()=> this.props.navigation.navigate('ViewMessage', {
                                id: l.roomId,
                                name: l.username,
                                chat: this.chatkit,
                                currentUserEmail : this.state.currentUser
                            })}
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
