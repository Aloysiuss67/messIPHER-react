import * as firebase from "react-native-firebase";
import {userDetails} from './authService';


/**
 * Returns the pin of the current user.
 */
export function getPin() {
    const pin = firebase.firestore().doc(`users/${userDetails().email}`).get()
        .then(doc => {
            const temp = doc.get('pin');
            return temp;
        })
        .catch(
        );
    return pin;
}

/**
 * Returns the pin of the current user.
 */
export function resetPin(newPin) {
    const data = {
        pin: newPin
    };

    firebase.firestore().doc(`users/${userDetails().email}`).update(data)
        .then()
        .catch(err => console.log(err)
        );
}


export function addNewUserToDB(user) {
    firebase.firestore().doc(`users/${user.email}`).set({ username: user.name, pin: user.pin})
        .then()
        .catch(err => console.log(err)
        );

}
