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
export async function updateFriends(useremail) {
    let friends = [];
    // user is already logged in collect their friends
    await firebase.firestore().collection(`users/${useremail}/myFriends`).get()
        .then((snapshot) => {
                snapshot.forEach((doc) => {
                    // find all of the user's friends
                    friends.push({
                        roomId: doc.get('chatToken'),
                        username: doc.get('username'),
                        email: doc.id,
                    });
                });
            },
        );

    return friends;
}

/**
 * Searches the database for all the users. The generates items for all of them.
 * Clicking on that item will attempt to add them as a friend and navigate to the
 * message window.
 * @param event input from search bar.
 */

export async function searchForNewFriends(searchFor){
    let users = []
    await firebase.firestore().collection(`users`).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                // checking for username and useremails.
                if (doc.id.toLowerCase().includes(searchFor) || doc.get('username').toLowerCase().includes(searchFor)) {
                    console.log(doc.id + "found this email")
                    users.push({
                        username: doc.get('username'),
                        email: doc.id
                    });
                } else {
                    // nothing matches search, do nothing
                }
            });
        })
        .catch((err) => {
            console.error(err)
        });
    return users
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

/**
 * Adds the user to firestore. Stores the users name and pin details.
 * @param user
 */
export function addNewUserToDB(user) {
    firebase.firestore().doc(`users/${user.email.toLowerCase()}`).set({username: user.name, pin: user.pin})
        .then()
        .catch(err => console.log(err),
        );

}
