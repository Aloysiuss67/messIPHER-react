import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from 'react-native-firebase'
import {createNewChatUser} from './services/chatService'
import {addNewUserToDB} from './services/firestoreService'

export default class SignUp extends React.Component {
    state = { name: '', email: '', password: '', confirmPassword: '', pin: '', errorMessage: null }

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('Main'))
            .catch(error => this.setState({ errorMessage: error.message }))

        //createNewChatUser(this.state)
        addNewUserToDB(this.state)


    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                {firebase.analytics.nativeModuleExists && <Text style={styles.module}>analytics()</Text>}
                {firebase.auth.nativeModuleExists && <Text style={styles.module}>auth()</Text>}
                {firebase.firestore.nativeModuleExists && <Text style={styles.module}>firestore()</Text>}
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={confirmPassword => this.setState({ confirmPassword })}
                    value={this.state.confirmPassword}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Create Your Pin"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={pin => this.setState({ pin })}
                    value={this.state.pin}
                />
                <Button title="Sign Up" onPress={this.handleSignUp} />
                <Button
                    title="Already have an account? Login"
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
