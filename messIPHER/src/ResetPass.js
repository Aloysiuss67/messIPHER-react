import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import {resetPassword} from './services/authService';
import {WToast} from 'react-native-smart-tip'
import {Avatar} from 'react-native-elements';


export default class ResetPass extends React.Component {
    state = { email: '', errorMessage: null }
    // server location for generating cute lil avatars
    avatar_url = 'http://localhost:5200/myAvatars/100/';

    handleReset = () => {
        const {email} = this.state
        resetPassword(email)
            .then(() =>  {
                this.toastSuccessMessage("Reset Email Sent")
                this.props.navigation.navigate('Login')
            })
            .catch(error => {
                this.toastMessage(error.message)
                this.setState({errorMessage: error.message})
            })
    }


    /**
     * Creates a toast notification for error messages
     * @param message
     */
    toastMessage = message => {
        WToast.show({
            data: message,
            backgroundColor: '#bd3926',
            duration: WToast.duration.SHORT,
            position: WToast.position.TOP,
        })
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
                <Text style={styles.headerStyle}>Reset Password</Text>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <Button title="Request Reset" onPress={this.handleReset} />
                <Button
                    title="Remembered your password? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
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
