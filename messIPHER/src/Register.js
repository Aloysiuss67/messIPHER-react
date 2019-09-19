import React from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator} from 'react-native';
import firebase from 'react-native-firebase';
import {createNewChatUser} from './services/chatServerService';
import {addNewUserToDB} from './services/firestoreService';
import {WModal, WToast} from 'react-native-smart-tip';
import {Avatar} from 'react-native-elements';

export default class SignUp extends React.Component {
    state = {name: '', email: '', password: '', confirmPassword: '', pin: '', errorMessage: null};
    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/100/';

    modalOpts = {
        data: 'Logging you in...',
        textColor: '#fff',
        backgroundColor: '#444444',
        position: WModal.position.CENTER,
        icon: <ActivityIndicator color='#fff' size={'large'}/>,
    };

    /**
     * Attempts to sign the user up, will present loading notifcation while it does so
     * and present toasts for error messages
     */
    handleSignUp = () => {
        WModal.show(this.modalOpts);
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                let user = {
                    email: this.state.email.toLowerCase(),
                    name: this.state.name.toLowerCase(),
                };
                // calls chatkit service agents to create new user
                createNewChatUser(user);
                // calls firestore service to add user data to db
                addNewUserToDB(this.state);
                this.toastSuccessMessage('Account Created! Welcome ' + user.name);
                this.props.navigation.navigate('Main', {currentUserEmail: user.email});

            })
            .catch(error => {
                WModal.hide();
                this.toastErrorMessage(error.message);
                this.setState({errorMessage: error.message});
            });

    };

    /**
     * Creates a toast notification for error messages
     * @param message
     */
    toastErrorMessage = message => {
        WToast.show({
            data: message,
            backgroundColor: '#bd3926',
            duration: WToast.duration.SHORT,
            position: WToast.position.TOP,
        });
    };

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
            <View style={styles.container}>
                <Avatar
                    size='xlarge'
                    rounded
                    source={{
                        uri: this.avatar_url + this.state.email,
                    }}
                />
                <Text style={styles.headerStyle}>Sign Up</Text>
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({name})}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={confirmPassword => this.setState({confirmPassword})}
                    value={this.state.confirmPassword}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Create Your Pin"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={pin => this.setState({pin})}
                    value={this.state.pin}
                />

                <Button title="Sign Up" onPress={this.handleSignUp}/>

                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
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
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
    },
    headerStyle: {
        fontSize: 24,
        paddingTop: 20,
    }
});
