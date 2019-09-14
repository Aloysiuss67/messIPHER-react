import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import {WToast} from 'react-native-smart-tip';


export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const {email, password} = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('Main', { currentUserEmail: email, chat: ''}))
            .catch(error => {
                this.toastMessage(error.message)
                this.setState({errorMessage: error.message})
            })
    }

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
                <Text>Login</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
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
    }
})
