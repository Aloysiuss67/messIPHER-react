import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import {resetPassword} from './services/authService';


export default class ResetPass extends React.Component {
    state = { email: '', errorMessage: null }

    handleReset = () => {
        const {email} = this.state

        resetPassword(email)
            .then(() =>  this.props.navigation.navigate('Login'))
            .catch(error => this.setState({errorMessage: error.message}))
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
                <Button title="Request Reset" onPress={this.handleReset} />
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={() => this.props.navigation.navigate('Register')}
                />
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
    }
})
