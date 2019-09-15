import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {updateFriends} from './services/firestoreService';
import {chatClientService} from './services/chatClientService';
import {WModal, WToast} from 'react-native-smart-tip';

export default class Main extends React.Component {
    state = {currentUser: null, search: '', friends: [], chat: null};
    isMount = false;
    chatkit = new chatClientService();

    // the loading notifcation for fetching from apis
    modalOpts = {
        data: 'Playing fetch...',
        textColor: '#fff',
        backgroundColor: '#444444',
        position: WModal.position.CENTER,
        icon: <ActivityIndicator color='#fff' size={'large'}/>
    }

    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/45/'

    /**
     * Overrides for the naviagtions options. Adds buttons for settings and find friends
     * @param navigation
     * @return {{headerRight: *, headerLeft: *}}
     */
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
                        func: navigation.getParam('getChatKit')
                    })}/>
            ),
            headerLeft: (
                <Icon
                    reverse
                    name='ios-settings'
                    type='ionicon'
                    color='#517aa4'
                    size={17}
                    onPress={() => navigation.navigate('Settings', {
                        currentUserEmail: navigation.getParam('currentUserEmail'),
                    })}/>
            ),
        };
    };

    /**
     * Function used by child to get parent's chatkit
     */
    _getChatKit = () => {
        return this.state.chat
    }

    /**
     * Adds listeners for screen focus and auth change. On screen focus we update the users list of friends
     * on auth change we reset all private fields. This presents a loading notifcation while fucntioning.
     */
    componentDidMount() {
        this.props.navigation.setParams({
            getChatKit: this._getChatKit,
        })
        this.isMount = true;
        WModal.hide()
        // need to add listeners for auth change
        WModal.show(this.modalOpts)
        firebase.auth().onAuthStateChanged(async () => {
            if (this.isMount) {
                this.setState({friends: []});
            }
            if (firebase.auth()) {

                console.log(this.props.navigation.getParam('currentUserEmail') + ' user details ');
                let userEmail = this.props.navigation.getParam('currentUserEmail');

                // if user it logged in, reset states
                if (userEmail != null) {
                    // create new chat kits and connect with this email
                    this.chatkit = new chatClientService();
                    await this.chatkit.connectToChat(userEmail);
                    // set state to contain reference to this chatkit
                    if (this.isMount) {
                        WModal.hide()
                        this.setState({chat: this.chatkit});
                        this.setState({currentUser: userEmail});
                    }
                }
            }
        });

        // called every time this pages takes focus, need to reset friends list
        this.props.navigation.addListener('didFocus', async () => {
            let userEmail = this.props.navigation.getParam('currentUserEmail');
            console.log(this.props.navigation.getParam('chat'))
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
                            leftAvatar={{source: {uri: this.avatar_url + l.email}}}
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
