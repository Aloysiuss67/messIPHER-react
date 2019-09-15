import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Avatar, ListItem, Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import DialogInput from 'react-native-dialog-input';
import {resetPin} from './services/firestoreService';
import {WToast} from 'react-native-smart-tip';

export default class Settings extends React.Component {
    state = {showDialog: false};

    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/100/';

    menu = [
        {
            key: '0',
            title: 'Reset Pin',
            icon: 'settings',
        },
    ];

    logout = [
        {
            key: '1',
            title: 'Logout',
            icon: 'ios-log-out',
        },
    ];

    componentDidMount() {
    }

    /**
     * Opens up the popup for reseting the users pin
     */
    showDialog() {
        this.setState({showDialog: true});
    }


    /**
     * Givin input form the dialog popup, a service agent call is made to reset pin
     * @param input
     * @return {Promise<void>}
     */
    async resetPin(input) {
        await resetPin(input);
        this.toastSuccessMessage('Pin Successfully Changed');
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


    render() {
        return (
            <View>
                <DialogInput isDialogVisible={this.state.showDialog}
                             title={'Change Your Pin'}
                             hintInput={'Input new pin here...'}
                             submitInput={(inputText) => {
                                 this.setState({showDialog: false});
                                 this.resetPin(inputText);
                             }}
                             closeDialog={() => {
                                 this.setState({showDialog: false});
                             }}>
                </DialogInput>
                <View style={styles.container_2}>
                    <Avatar
                        size='xlarge'
                        rounded
                        source={{
                            uri: this.avatar_url + this.props.navigation.getParam('currentUserEmail'),
                        }}
                    />
                </View>
                <View style={styles.center}>
                    <Text style={styles.text_style}>
                        {this.props.navigation.getParam('currentUserEmail')}
                    </Text>
                </View>
                <View style={styles.body}>
                    {
                        this.menu.map((l, i) => (
                            <ListItem
                                key={i}
                                leftIcon={{
                                    name: l.icon,
                                }}
                                title={l.title}
                                onPress={() => {
                                    this.showDialog();
                                }}
                                bottomDivider
                            />
                        ))
                    }
                    {
                        this.logout.map((l, i) => (
                            <ListItem
                                key={i}
                                leftIcon={{name: l.icon, type: 'ionicon'}}
                                title={l.title}
                                onPress={() => {
                                    firebase.auth().signOut();
                                }}
                                bottomDivider
                            />
                        ))
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container_2: {
        paddingTop: 10,
        flex: 10,
        alignItems: 'center',
    },
    body: {
        paddingTop: 20,
    },
    center: {
        alignItems: 'center',
    },
    text_style: {
        paddingTop: 180,
        fontSize: 22,
        fontWeight: 'bold',
        alignItems: 'center',
    },

    listItem: {},
});
