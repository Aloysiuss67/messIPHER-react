import firebase from 'react-native-firebase'


export function registerUser(value) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
            .then(
                res => resolve(res),
                err => reject(err));
    });
}

/**
 * Attempts to log in a user using their firebase credentials supplied from a form.
 * @param value
 */
export function loginUser(value) {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(value.email, value.password)
            .then(
                res => resolve(res),
                err => reject(err));
    });
}

/**
 * Logs user out of the app.
 */
export function logoutUser()
{
    return new Promise((resolve, reject) => {
        if (firebase.auth().currentUser) {
            firebase.auth().signOut()
                .then(() => {
                    resolve();
                }).catch((error) => {
                reject();
            });
        }
    });
}

/**
 * Sends a reset password request to the inputed email address, if one exists.
 * @param useremail
 */
export function resetPassword(useremail) {
    return new Promise((resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(useremail)
            .then(function() {
                resolve();
                // Password reset email sent.
            })
            .catch(function(error) {
                reject(error);
                // Error occurred. Inspect error.code.
            });

    });
}




/**
 * Returns the current firebase users.
 */
export function userDetails() {
    return firebase.auth().currentUser;
}

