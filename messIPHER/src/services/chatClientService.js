import {ChatManager, TokenProvider} from '@pusher/chatkit-client';
import {getUserRooms} from './chatServerService';


export class chatClientService {
    // chat current user, very important for chatkit
    currentUser;

    // main list of messages
    inbox = []


    /**
     * Using the firebase authenticated email, the we create a chat manager to assign this user to their
     * chat rooms and add webhooks for new messages. When a new message is recieved the hook adds it to
     * the user's inbox.
     * @param userEmail
     */
    async connectToChat(userEmail) {
        this.inbox = [];
        const tokenProvider = new TokenProvider({
            url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f1b5ce13-d92e-4019-82a8-6255507b7144/token',
        });

        this.chatManager = new ChatManager({
            instanceLocator: 'v1:us1:f1b5ce13-d92e-4019-82a8-6255507b7144',
            userId: userEmail,
            tokenProvider,
        });

        // wait for the connection before moving on
        this.currentUser = await this.chatManager.connect();

        const chatrooms = await getUserRooms(userEmail);

        for (let room of chatrooms) {
            await this.currentUser.subscribeToRoomMultipart({
                roomId: room.id,
                messagelimit: 50,
                hooks: {
                    onMessage: message => {
                        // need to do that to get the message
                        this.inbox.push({
                            roomid: room.id,
                            message: message.parts[0].payload.content,
                            userID: message.senderId,
                        });
                        //this.messagesSubject.next(this.inbox);
                    },
                },
            });
        }
        console.log(this.inbox)
    }


    /**
     * Allows the users to send messages to a certain room.
     * @param message the string message to send
     * @param roomID the room we are sending the message to
     */
    sendMessage(message, roomID) {
        return this.currentUser.sendMessage({
            text: message,
            roomId: roomID,
        });
    }


    /**
     * Subscribes a user to a certain room. This has a hook to
     * @param roomId
     */
    async subscribeUserToRoom(roomId) {
        console.log(roomId + " trying to subscribe user to room")
        await this.currentUser.subscribeToRoomMultipart({
            roomId: roomId,
            messagelimit: 50,
            hooks: {
                onMessage: message => {
                    // need to do that to get the message
                    this.inbox.push({
                        roomid: roomId,
                        message: message.parts[0].payload.content,
                        userID: message.senderId,
                    });
                },
            },
        });
    }

    /**
     * Getter for the CHATKIT user.
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Getter for the behaviour subject collection of user messages.
     */
    getMessages(roomId) {
        let tempArray = []
        let key = 0
        this.inbox.forEach((i) =>{
            if (i.roomid === roomId) {
                i.key = (key++).toString()
                tempArray.push(i)
            }
        })
        return tempArray;
    }
}
