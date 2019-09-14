import React from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase';

export default class Settings extends React.Component {

    componentDidMount() {
    }



    render() {
        //const {currentUser, search} = this.state;
        return (
            <View>
                <Button
                    title="Logout"
                    onPress={() => {
                        firebase.auth().signOut()
                    }}
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
});
