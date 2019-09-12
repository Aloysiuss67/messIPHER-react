import {Observable, BehaviorSubject} from 'rxjs';
import {ChatManager, TokenProvider} from '@pusher/chatkit-client';


export class chatClientService {
    roomID = '26350827';
    rooms = ['26350827', '26319556', '26319533'];


        // chat current user, very important for chatkit
        //private currentUser;

        // unsure ill use these
    messagesSubject = new BehaviorSubject([]);
    //
    // // main list of messages
    //inbox: Array<{ roomid; message; userID; }> = [];
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
            url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a282f0ee-db04-4558-81f2-205a40772748/token',
        });

        this.chatManager = new ChatManager({
            instanceLocator: 'v1:us1:a282f0ee-db04-4558-81f2-205a40772748',
            userId: userEmail,
            tokenProvider,
        });

        // wait for the connection before moving on
        this.currentUser = await this.chatManager.connect();

        const chatrooms = await this.ChatServer.getUserRooms(userEmail);

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
                        this.messagesSubject.next(this.inbox);
                    },
                },
            });
        }
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
                    this.messagesSubject.next(this.inbox);
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
    getMessages() {
        return this.messagesSubject;
    }
}
