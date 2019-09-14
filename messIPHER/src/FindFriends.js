import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {searchForNewFriends, updateFriends} from './services/firestoreService';
import { makeNewRoom, addUsersToRoom } from './services/chatServerService';
import {chatClientService} from './services/chatClientService';

export default class FindFriends extends React.Component {
    state = {currentUser: null, search: '', list: [], chat: null};
    chatkit = new chatClientService();
    isMount = false


    avatar = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

    componentDidMount() {
        // switch mount to true, to protect leaks on setState
        this.isMount = true
        // methods to call when page gets focus
        this.props.navigation.addListener("didFocus", () => {
            const currentUser = this.props.navigation.getParam('currentUserEmail')
            if (this.isMount){
                this.setState({currentUser: currentUser});
                console.log(this.props.navigation.getParam('chat'))
            }

        })

        // need to add listeners for auth change
        firebase.auth().onAuthStateChanged(()=> {
            if (firebase.auth()) {
                let userEmail = this.props.navigation.getParam('currentUserEmail');

                // if user it logged in, reset chat states
                if (userEmail != null) {
                    // create new chat kits and connect with this email
                    this.chatkit = new chatClientService()

                    this.chatkit.connectToChat(userEmail)
                    // set state to contain reference to this chatkit
                    if(this.isMount) {
                        this.setState({chat: this.chatkit})
                    }
                }
            }
        })
    }

    componentWillUnmount() {
        this.isMount = false;
    }

    /**
     * Called every time the search bar has text entered into it.
     * @param search
     */
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
            currentUserEmail: this.props.navigation.getParam('currentUserEmail'),
            chat: this.state.chat
        })
    }


    /**
     * Checks the user's firestore collection of friends. If the friend passed doesnt exist on that
     * collection then they will be added to that collection. If they already exist, the onFriendList
     * tag will flip.
     * @param friend the friend details they have searched for.
     */
    async checkIfFriends(friend) {
        let user = this.props.navigation.getParam('currentUserEmail')

        await firebase.firestore().collection(`users/${user}/myFriends`).get()
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
        let userEmail = this.props.navigation.getParam('currentUserEmail')
        let username = await firebase.firestore().doc(`users/${userEmail}`).get()
            .then(doc => {
                return doc.get('username')
            });

        // data stored on firestore
        // user is automatically added to rooms they create
        this.roomId = await makeNewRoom(userEmail, userEmail + friend.email);

        let friendData = {
            chatToken: this.roomId,
            username: friend.username
        };
        let userData = {
            chatToken: this.roomId,
            username: username
        };

        // add friend to user's friends list
        firebase.firestore().doc(`users/${userEmail}/myFriends/${friend.email}`)
            .set(friendData)
            .then(res => {
                console.log("new friend added")
                // this.presentToast('New Friend added');
            })
            .catch((err) => {
                console.log(err)
            });
        // add user to friend's friends list
        firebase.firestore().doc(`users/${friend.email}/myFriends/${userEmail}`)
            .set(userData)
            .then(res => {
            })
            .catch((err) => {
                console.log(err)
            });
        // adds friend to that room as well
        addUsersToRoom(this.roomId, friend.email);
        // subscribes user to this new room, which should hook new messages
        this.state.chat.connectToChat(userEmail);
    }


    render() {
        const { search} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Find new friends..."
                    onChangeText={this.updateSearch}
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
