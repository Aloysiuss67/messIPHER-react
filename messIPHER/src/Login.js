import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase'
import {WToast, WModal} from 'react-native-smart-tip';
import {Avatar} from 'react-native-elements';


export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }
    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/100/';

    // loading pop up notification
    modalOpts = {
        data: 'Logging you in...',
        textColor: '#fff',
        backgroundColor: '#444444',
        position: WModal.position.CENTER,
        icon: <ActivityIndicator color='#fff' size={'large'}/>
    }

    /**
     * Attempts to log in a user using their firebase credentials supplied from a form.
     */
    handleLogin = () => {
        const {email, password} = this.state
        WModal.show(this.modalOpts)
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                    this.props.navigation.navigate('Main', {currentUserEmail: email, chat: ''})
                    this.setState({email: '', password: ''})
                }
            )
            .catch(error => {
                WModal.hide()
                this.toastMessage(error.message)
                this.setState({errorMessage: error.message})
            })
    }


    /**
     * presents toast message for errors.
     */
    toastMessage = message => {
        WToast.show({
            data: message,
            backgroundColor: '#bd3926',
            duration: WToast.duration.SHORT,
            position: WToast.position.TOP,
        })
    }

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
                <Text style={styles.headerStyle}>Welcome to messIPHER</Text>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <Button title="Login" onPress={this.handleLogin} />
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={() => this.props.navigation.navigate('Register')}
                />
                <Button
                    title="Forgot your password? Reset"
                    onPress={() => this.props.navigation.navigate('ResetPass')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    headerStyle: {
        fontSize: 24,
        paddingTop: 20
    }
})
