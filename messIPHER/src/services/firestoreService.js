import * as firebase from 'react-native-firebase';
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
 * Collects the current user's list of friends.
 * @return {Array} the updated list of the user's friends
 */
export function updateFriends() {
    let friends = [];
    // user is already logged in collect their friends
    firebase.firestore().collection(`users/${userDetails().email}/myFriends`).get()
        .then((snapshot) => {
                snapshot.forEach((doc) => {
                    // find all of the user's friends
                    friends.push({
                        roomid: doc.get('chatToken'),
                        username: doc.get('username'),
                        email: doc.id,
                    });
                });
            },
        );

    return friends;
}


/**
 * Returns the pin of the current user.
 */
export function resetPin(newPin) {
    const data = {
        pin: newPin,
    };

    firebase.firestore().doc(`users/${userDetails().email}`).update(data)
        .then()
        .catch(err => console.log(err),
        );
}


export function addNewUserToDB(user) {
    firebase.firestore().doc(`users/${user.email}`).set({username: user.name, pin: user.pin})
        .then()
        .catch(err => console.log(err),
        );

}
