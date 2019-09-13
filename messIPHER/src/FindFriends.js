import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import { searchForNewFriends } from './services/firestoreService';

export default class FindFriends extends React.Component {
    state = {currentUser: null, search: ''};

    list = [
    ];

    avatar = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

    componentDidMount() {
        const {currentUser} = firebase.auth();
        this.setState({currentUser});
    }

    updateSearch = async search => {
        this.setState({search});
        if (search != '') {
            let temp = search.toLowerCase()
            searchForNewFriends(temp).then((users) => {
                    console.log(users.length)
                    this.list = users
                }
            )
        }
    };

    render() {
        const {currentUser, search} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Find your friends..."
                    onChangeText={this.updateSearch}
                    // onClear={()=> this.list = []}
                    value={search}
                    platform={'ios'}
                />
                {
                    this.list.map((l, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={{source: {uri: this.avatar,}}}
                            title={l.username}
                            subtitle={l.email}
                            bottomDivider
                            onPress={()=> this.props.navigation.navigate('ViewMessage')}
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
