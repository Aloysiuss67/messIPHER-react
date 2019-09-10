import axios from 'axios';


/**
 * Attempts to reach the server and add a new user to the chat service. This will also assign them to the default room
 * @param user
 */
export function createNewChatUser(user) {
    axios.post('http://localhost:5200/users', {user})
        .then(() => {
        })
        .catch(error => console.error(error));
}


/**
 * Attempts to create a new room. On success, the user is automatically added to that room.
 * Returns the id of the room created.
 * @param useremail
 * @param roomName
 */
export function makeNewRoom(useremail, roomName) {
    let data = {
        creator: useremail,
        name: roomName,
    };
    const roomid = axios.post('http://localhost:5200/newRoom', {data})
        .then((res) => {
            // returnning the room id that was created
            return res.data.id;
        })
        .catch(error => console.error(error));
    return roomid;
}

/**
 * Added the user to a room, tbis means they can get and send messages.
 * @param roomId
 * @param friendEmail
 */
export function addUsersToRoom(roomId, friendEmail) {
    let data = {
        id: roomId,
        userIds: [friendEmail],
    };
    axios.post('http://localhost:5200/addUserToRoom', {data})
        .then((res) => {
        })
        .catch(error => console.error(error));
}

/**
 * Gets all the rooms the user is currently a part of.
 * @param userid
 */
export function getUserRooms(userid) {
    let data = {
        userId: userid,
    };
    const rooms = axios.post('http://localhost:5200/getUserRooms', {data})
        .then((res) => {
            return res.data;
        })
        .catch(error => console.error(error));
    return rooms;
}




