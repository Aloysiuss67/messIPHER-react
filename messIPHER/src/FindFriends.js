import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {searchForNewFriends, updateFriends} from './services/firestoreService';
import { makeNewRoom, addUsersToRoom } from './services/chatServerService';
import {chatClientService} from './services/chatClientService';
import {userDetails} from './services/authService';

export default class FindFriends extends React.Component {
    state = {currentUser: null, search: '', list: []};
    chatkit = new chatClientService();
    username = '';

    avatar = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

    componentDidMount() {
        this.props.navigation.addListener("didFocus", async () => {
            const currentUser = firebase.auth();
            this.setState({currentUser: currentUser});
        })


    }

    updateSearch = async search => {
        this.setState({search});
        if (search != '') {
            let temp = search.toLowerCase()
            await searchForNewFriends(temp).then((users) => {
                    console.log(users.length)
                    this.setState({list: users})
                }
            )
        }
    };

    /**
     * Calls addNewFriend and then navigates to that friend's messages.
     */
    async viewMessage(friend) {
        const check = await this.checkIfFriends(friend);
        // do we need to add them as a friend
        if (!this.onFriendsList) {
            await this.addNewFriend(friend);
        }
        // move to message page
        this.props.navigation.navigate('ViewMessage', {
            id: this.roomId,
            name: friend.username,
        })
    }


    /**
     * Checks the user's firestore collection of friends. If the friend passed doesnt exist on that
     * collection then they will be added to that collection. If they already exist, the onFriendList
     * tag will flip.
     * @param friend the friend details they have searched for.
     */
    async checkIfFriends(friend) {
        await firebase.firestore().collection(`users/${userDetails().email}/myFriends`).get()
            .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        // are the users already friends?
                        if (doc.id.includes(friend.email)) {
                            this.roomId = doc.get('chatToken');
                            this.onFriendsList = true;
                            return;
                        }
                    });
                }
            )
            .catch((err) => {
            });

        return Promise.resolve(true);
    }

    /**
     * Called when the users selects another user. If this is their first interaction then
     * this method will add them to their friend's list (and maybe generatee a chat token)
     */
    async addNewFriend(friend) {
        let user = await userDetails()
        let username = await firebase.firestore().doc(`users/${user.email}`).get()
            .then(doc => {
                return doc.get('username')
                //this.username = doc.get('username');
            });

        // data stored on firestore
        // user is automatically added to rooms they create
        this.roomId = await makeNewRoom(user.email, user.email + friend.email);

        let friendData = {
            chatToken: this.roomId,
            username: friend.username
        };
        let userData = {
            chatToken: this.roomId,
            username: username
        };

        // add friend to user's friends list
        firebase.firestore().doc(`users/${user.email}/myFriends/${friend.email}`)
            .set(friendData)
            .then(res => {
                console.log("new friend added")
                // this.presentToast('New Friend added');
            })
            .catch((err) => {
                console.log(err)
            });
        // add user to friend's friends list
        firebase.firestore().doc(`users/${friend.email}/myFriends/${user.email}`)
            .set(userData)
            .then(res => {
            })
            .catch((err) => {
                console.log(err)
            });
        // adds friend to that room as well
        addUsersToRoom(this.roomId, friend.email);
        // subscribes user to this new room, which should hook new messages
        this.chatkit.connectToChat(user.email);
    }


    render() {
        const {currentUser, search} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Find new friends..."
                    onChangeText={this.updateSearch}
                    // onClear={()=> this.list = []}
                    value={search}
                    platform={'ios'}
                />
                {
                    this.state.list.map((l, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={{source: {uri: this.avatar,}}}
                            title={l.username}
                            subtitle={l.email}
                            bottomDivider
                            onPress={()=> this.viewMessage({
                                email: l.email,
                                username: l.username
                            })}
                        />
                    ))
                }
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
