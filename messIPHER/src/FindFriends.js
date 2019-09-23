import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {searchForNewFriends} from './services/firestoreService';
import {makeNewRoom, addUsersToRoom} from './services/chatServerService';
import {chatClientService} from './services/chatClientService';
import {WModal, WToast} from 'react-native-smart-tip';

export default class FindFriends extends React.Component {
    state = {currentUser: null, search: '', list: [], chat: null, roomId: '', onFriendsList: false};
    chatkit = new chatClientService();
    isMount = false;

    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/45/';

    // the loading notifcation for fetching from apis
    modalOpts = {
        data: 'Find you two a room...',
        textColor: '#fff',
        backgroundColor: '#444444',
        position: WModal.position.CENTER,
        icon: <ActivityIndicator color='#fff' size={'large'}/>
    }


    /**
     * Adds listeners for screen focus and auth change. On screen focus we update the current users
     * on auth change we reset all private fields.
     */
    componentDidMount() {
        // switch mount to true, to protect leaks on setState
        this.isMount = true;
        // methods to call when page gets focus
        this.props.navigation.addListener('didFocus', () => {
            const currentUser = this.props.navigation.getParam('currentUserEmail');
            if (this.isMount) {
                this.setState({currentUser: currentUser});
            }
        });

        // need to add listeners for auth change
        firebase.auth().onAuthStateChanged(() => {
            if (firebase.auth()) {
                // get chatkit from parent
                this.chatkit = this.props.navigation.getParam('func')();
                let userEmail = this.props.navigation.getParam('currentUserEmail');

                // set state to contain reference to this chatkit
                if (this.isMount) {
                    this.setState({chat: this.chatkit});
                }

            }
        });
    }

    /**
     * Boolean flag for unmount so not to mem leak.
     */
    componentWillUnmount() {
        this.isMount = false;
    }

    /**
     * Creates a toast notification for success messages
     * @param message
     */
    toastSuccessMessage = message => {
        WToast.show({
            data: message,
            backgroundColor: '#2a7fbd',
            duration: WToast.duration.SHORT,
            position: WToast.position.TOP,
        });
    };

    /**
     * Called every time the search bar has text entered into it.
     * @param search
     */
    updateSearch = async search => {
        this.setState({search});
        if (search != '') {
            let temp = search.toLowerCase();
            await searchForNewFriends(temp).then((users) => {
                    console.log(users.length);
                    this.setState({list: users});
                },
            );
        }
    };

    /**
     * Calls addNewFriend and then navigates to that friend's messages.
     */
    async viewMessage(friend) {
        const check = await this.checkIfFriends(friend);
        // do we need to add them as a friend
        if (!this.state.onFriendsList) {
            WModal.show(this.modalOpts)
            await this.addNewFriend(friend);
            this.toastSuccessMessage('New Friend Added!');
        }
        console.log(this.state.roomId);
        WModal.hide()
        // move to message page
        this.props.navigation.navigate('ViewMessage', {
            id: this.state.roomId,
            name: friend.username,
            currentUserEmail: this.props.navigation.getParam('currentUserEmail'),
            chat: this.props.navigation.getParam('func')(),
        });
    }


    /**
     * Checks the user's firestore collection of friends. If the friend passed doesnt exist on that
     * collection then they will be added to that collection. If they already exist, the onFriendList
     * tag will flip.
     * @param friend the friend details they have searched for.
     */
    async checkIfFriends(friend) {
        let user = this.props.navigation.getParam('currentUserEmail');

        await firebase.firestore().collection(`users/${user}/myFriends`).get()
            .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        // are the users already friends?
                        if (doc.id.includes(friend.email)) {
                            let tempRoomId = doc.get('chatToken');
                            this.setState({roomId: tempRoomId, onFriendsList: true});
                            return;
                        }
                    });
                },
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
        let userEmail = this.props.navigation.getParam('currentUserEmail');
        let username = await firebase.firestore().doc(`users/${userEmail}`).get()
            .then(doc => {
                return doc.get('username');
            });

        // data stored on firestore
        // user is automatically added to rooms they create
        let roomId = await makeNewRoom(userEmail, userEmail + friend.email);
        this.setState({roomId: roomId})

        let friendData = {
            chatToken: roomId,
            username: friend.username,
        };
        let userData = {
            chatToken: roomId,
            username: username,
        };

        // add friend to user's friends list
        firebase.firestore().doc(`users/${userEmail}/myFriends/${friend.email}`)
            .set(friendData)
            .then(res => {
                console.log('new friend added');
            })
            .catch((err) => {
                console.log(err);
            });
        // add user to friend's friends list
        firebase.firestore().doc(`users/${friend.email}/myFriends/${userEmail}`)
            .set(userData)
            .then(res => {
            })
            .catch((err) => {
                console.log(err);
            });
        // adds friend to that room as well
        addUsersToRoom(roomId, friend.email);
        // subscribes user to this new room, which should hook new messages
        await this.props.navigation.getParam('func')().subscribeUserToRoom(roomId)
        // this.state.chat.connectToChat(userEmail);
    }

// ------------------------- METHODS FOR RENDER AND STYLES BELOW


    render() {
        const {search} = this.state;
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
                            leftAvatar={{source: {uri: this.avatar_url + l.email}}}
                            title={l.username}
                            subtitle={l.email}
                            bottomDivider
                            onPress={() => this.viewMessage({
                                email: l.email,
                                username: l.username,
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
