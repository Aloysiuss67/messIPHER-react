import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {updateFriends} from './services/firestoreService';
import {chatClientService} from './services/chatClientService';

export default class Main extends React.Component {
    state = {currentUser: null, search: '', friends: [], chat: null};
    isMount = false;
    chatkit = new chatClientService();


    avatar_url1 = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg';
    avatar_url2 = 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg';

    static navigationOptions = ({navigation}) => {
        return {
            headerRight: (
                <Icon
                    reverse
                    name='ios-person-add'
                    type='ionicon'
                    color='#517aa4'
                    size={17}
                    onPress={() => navigation.navigate('FindFriends', {
                        currentUserEmail: navigation.getParam('currentUserEmail'),
                    })}/>
            ),
            headerLeft: (
                <Icon
                    reverse
                    name='ios-settings'
                    type='ionicon'
                    color='#517aa4'
                    size={17}
                    onPress={() => navigation.navigate('Settings')}/>
            ),
        };
    };


    componentDidMount() {
        this.isMount = true;
        // need to add listeners for auth change
        firebase.auth().onAuthStateChanged(() => {
            if (firebase.auth()) {
                console.log(this.props.navigation.getParam('currentUserEmail') + ' user details ');
                let userEmail = this.props.navigation.getParam('currentUserEmail');

                // if user it logged in, reset states
                if (userEmail != null) {
                    // create new chat kits and connect with this email
                    this.chatkit = new chatClientService();
                    this.chatkit.connectToChat(userEmail);
                    // set state to contain reference to this chatkit
                    if (this.isMount) {
                        this.setState({chat: this.chatkit});
                        this.setState({currentUser: userEmail});
                    }
                }
            }
        });

        // called every time this pages takes focus, need to reset friends list
        this.props.navigation.addListener('didFocus', async () => {
            let userEmail = this.props.navigation.getParam('currentUserEmail');

            if (this.props.navigation.getParam('chat') != null){
                // new chatkit is potentiall created in find friends, need to update
                if (this.isMount) {
                    this.setState({chat: this.props.navigation.getParam('chat')});
                    this.chatkit = this.props.navigation.getParam('chat')
                }
            }

            if (this.isMount) {
                this.setState({friends: await updateFriends(userEmail)});
            }

        });
    }

    componentWillUnmount() {
        this.isMount = false;
    }

    /**
     * Called every time the search bar has text entered into it.
     * @param search
     */
    updateSearch = search => {
        this.setState({search: search});
    };

    /**
     * Given input from a search bar, this attempts to find a friend that matches that search.
     * If their is a match, we reshuffle the friends list to put that searched friend in
     * the front of that list.
     * @param event input from search bar
     */
    doSearch(friendUser) {
        const search = friendUser.toLowerCase();
        const index = this.state.friends.findIndex(usr => ((usr.username.toLowerCase() === search) || (usr.email.toLowerCase() === search)));
        console.log(index + ' index');
        if (index !== -1) {
            this.arrayReshuffle(index, 0);
        }
    }


    /**
     * Rearranges the friend's list so that one user is placed in a new location
     * @param oldIndex old location of friend
     * @param newIndex new location of friend
     */
    arrayReshuffle(oldIndex, newIndex) {
        if (newIndex >= this.state.friends.length) {
            let k = newIndex - this.state.friends.length + 1;
            while (k--) {
                this.friends.push(undefined);
            }
        }
        let tempArray = this.state.friends;
        tempArray.splice(newIndex, 0, tempArray.splice(oldIndex, 1)[0]);
        console.log(tempArray);
        if (this.isMount) {
            this.setState({friends: tempArray});
        }
    }


    render() {
        const {search} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Find your friends..."
                    onChangeText={this.updateSearch}
                    onEndEditing={() => {
                        this.doSearch(search);
                        this.setState({search: ''});
                    }}
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
                            onPress={() => this.props.navigation.navigate('ViewMessage', {
                                id: l.roomId,
                                name: l.username,
                                chat: this.state.chat,
                                currentUserEmail: this.state.currentUser,
                            })}
                            bottomDivider
                        />
                    ))
                }
                <Button
                    title="Logout"
                    onPress={() => {
                        if (this.isMount){
                            this.setState({currentUser: null, friends: []});
                        }
                        firebase.auth().signOut();
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
