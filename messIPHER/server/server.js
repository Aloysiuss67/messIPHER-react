require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
    key: process.env.CHATKIT_SECRET_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('all green!');
});


/**
 * Attempts to create a new user on the chatkit service. Within the req should be a
 * username, and a userid.
 * Fails if a user with that id already exists.
 */
app.post('/users', (req, res) => {
    console.log(chatkit)
    const username = req.body.user.name;
    const email = req.body.user.id;
    console.log('attempting to add new user' + email);
    chatkit
        .createUser({
            id: email,
            name: username,
        })
        .then(() => {
            console.log('successfully added user ' + email);
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.error === 'services/chatkit/user_already_exists') {
                console.log(`User already exists: ${username}`);
                res.sendStatus(200);
            } else {
                console.log('unsuccessfully added user ' + email);
                console.log(err)
                res.status(err.status).json(err);
            }
        });
});

/**
 * Attempts to create a new user on the chatkit service. Within the req should be a
 * creator id, and a roomname.
 */
app.post('/newRoom', (req, res) => {
    console.log("try to create new room");
    const roomCreator = req.body.data.creator;
    const roomName = req.body.data.name;
    console.log('trying to create new room ' + roomCreator + roomName);
    chatkit
        .createRoom({
            creatorId: roomCreator,
            name: roomName,
        })
        .then((room) => {
            // returns a json containing the created roomid
            console.log(room.id)
            res.send({id: room.id});
        })
        .catch(err => {
            console.log(err)
            res.status(err.status).json(err);
        });
});


/**
 * Attempts to add a user to a room, this is needed for them to send messages. Within the req should be a
 * roomid, and a userid.
 */
app.post('/addUserToRoom', (req, res) => {
    console.log("trying to add new user to room");
    const roomid = req.body.data.id;
    const user = req.body.data.userIds;
    console.log('trying to add users to room: ' + user + ' ' + roomid);
    chatkit
        .addUsersToRoom({
            roomId: roomid,
            userIds: user
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(err)
            res.status(err.status).json(err);
        });
});

/**
 * Returns an array of all the rooms the user is a part of.
 */
app.post('/getUserRooms', (req, res) => {
    console.log("trying to get all users rooms");
    const userid = req.body.data.userId
    console.log('attempting to get rooms' + userid)
    chatkit
        .getUserRooms({
            userId: userid
        })
        .then((rooms) => {
            res.send(rooms)
        })
        .catch(err => {
            res.status(err.status).json(err);
        });
});


/**
 * Given a user id, attempts to delete that user.
 */
app.post('/deleteUser', (req, res) => {
    const userid = req.body.data.userId
    chatkit
        .asyncDeleteUser({
            userId: userid
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            res.status(err.status).json(err);
        });
});

/**
 * Given a room id, attempts to delete that room.
 */
app.post('/deleteRoom', (req, res) => {
    const roomid = req.body.data.rooomId
    chatkit
        .asyncDeleteRoom({
            roomId: roomid
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            res.status(err.status).json(err);
        });
});

/**
 * Token provider if moved into prod. Currently not using.
 */
app.post('/authenticate', (req, res) => {
    const authData = chatkit.authenticate({
        userId: req.query.user_id,
    });
    res.status(authData.status).send(authData.body);
});

app.set('port', process.env.PORT || 5200);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
