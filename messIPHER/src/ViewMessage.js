import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    RefreshControl,
    Button,
    Alert
} from 'react-native';

import {HeaderBackButton} from 'react-navigation-stack';
import DialogInput from 'react-native-dialog-input';
import {getPin} from './services/firestoreService';
import {Icon} from 'react-native-elements';


export default class ViewMessage extends React.Component {
    state = {newMessage: '', locked: true, showDialog: false};

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('name'),
            headerLeft: (<HeaderBackButton
                onPress={() => {
                    navigation.navigate('Home', {
                        currentUserEmail: navigation.getParam('currentUserEmail'),
                        chat: navigation.getParam('chat'),
                    });
                }}/>),
        };
    };


    componentDidMount() {
    }

    /**
     * Sends the messages based on what is in the message input field.
     */
    sendMessage() {
        let chat = this.props.navigation.getParam('chat');
        let roomid = this.props.navigation.getParam('id');
        if (this.state.newMessage.length !== 0) {
            chat.sendMessage(this.state.newMessage, roomid).then(() => {
                this.setState({newMessage: ''});
            });
        }
    }

    /**
     * Sends a locked messages based on what is in the message input field.
     */
    sendLockedMessage() {
        let chat = this.props.navigation.getParam('chat');
        let roomid = this.props.navigation.getParam('id');
        if (this.state.newMessage.length !== 0) {
            const lockMessage = '::LOCK::' + this.state.newMessage;
            chat.sendMessage(lockMessage, roomid).then(() => {
                this.setState({newMessage: ''});
            });
        }
    }

    /**
     * If the messages are currently locked, this will open up a dialog box for users to enter their pin
     * If the messages are unlocked, this will lock them
     */
    showDialog(){
        if (this.state.locked) {
            this.setState({showDialog: true})
        }
        else {
            this.setState({locked: true} )
        }
    }

    /**
     * Calls the firebase agent to get the users pin, and if it matches the input, messages unlock
     */
    async unlock(inputText){
        let userPin = await getPin()

        if (userPin === inputText){
            this.setState({
                locked: !this.state.locked
            })
        }

    }

    /**
     * Called every time the user inputs text, to store it locally.
     */
    updateMessage = message => {
        this.setState({newMessage: message});
    };



    render() {
        const {refreshing = false} = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <DialogInput isDialogVisible={this.state.showDialog}
                             title={"Unlock"}
                             message={"Confirm your pin"}
                             hintInput ={"Input pin here..."}
                             submitInput={ (inputText) => {
                                 this.setState({showDialog: false})
                                 this.unlock(inputText)
                             } }
                             closeDialog={ () => {
                                 this.setState( {showDialog: false })
                             }}>
                </DialogInput>
                <View style={styles.body}>
                    <ScrollView
                        style={styles.messages}
                        contentContainerStyle={styles.scroll_container}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.refreshing}
                            />
                        }>
                        <FlatList
                            data={this.props.navigation.getParam('chat').getMessages(this.props.navigation.getParam('id'))}
                            renderItem={this.renderItem}/>
                    </ScrollView>

                    <View style={styles.message_box}>
                        <View style={styles.button_container}>
                            <Icon
                                reverse
                                name='ios-glasses'
                                type='ionicon'
                                color='#517aa4'
                                size={17}
                                onPress={() => this.showDialog()}
                            />
                        </View>
                        <TextInput
                            style={styles.text_field}
                            multiline={true}
                            onChangeText={this.updateMessage}
                            value={this.state.newMessage}
                            placeholder="Aa"
                        />

                        <View style={styles.button_container}>
                            <Icon
                                reverse
                                name='ios-lock'
                                type='ionicon'
                                color='#517aa4'
                                size={17}
                                onPress={() =>  this.sendLockedMessage()}
                              />
                        </View>
                        <View style={styles.button_container}>
                            <Icon
                                reverse
                                name='ios-send'
                                type='ionicon'
                                color='#517aa4'
                                size={17}
                                onPress={() => this.sendMessage()}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }

    renderItem = ({item}) => {
        let isCurrentUser = (item.userID === this.props.navigation.getParam('currentUserEmail'));

        let box_style = isCurrentUser ? 'current_user_msg' : 'other_user_msg';
        let username_style = isCurrentUser
            ? 'current_user_username'
            : 'other_user_username';

        let message = item.message;
        if (message.substring(0,8) === '::LOCK::'){
            if (this.state.locked){
                message = 'I will see you at lunch'
            }
            else {
                message = message.substring(8)
            }
        }

        return (
            <View key={item.key} style={styles.msg}>
                {/*<View style={styles.msg_wrapper}>*/}
                <View style={styles.username}>
                    <Text style={[styles.username_text, styles[username_style]]}>
                        {this.props.navigation.getParam('name')}
                    </Text>
                </View>
                <View style={[styles.msg_body, styles[box_style]]}>
                    <Text style={styles[`${box_style}_text`]}>{message}</Text>
                </View>
                {/*</View>*/}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        alignSelf: 'stretch',
    },
        body: {
            flex: 9,
        },
    scroll_container: {
        paddingBottom: 20,
    },
    messages: {
        flex: 8,
        flexDirection: 'column',
        padding: 8,
    },
    current_user_msg: {
        backgroundColor: '#439bff',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    current_user_msg_text: {
        color: '#fff',
    },
    current_user_username: {
        opacity: 0,
    },

    other_user_msg: {
        backgroundColor: '#f6f8fa',
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    other_user_msg_text: {
        color: '#333',
    },
    other_user_username: {
        color: '#484848',
    },
    message_box: {
        flex: 0.1,
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        justifyContent: 'space-between',
    },
    username: {
        marginTop: 15,
    },
    username_text: {
        fontSize: 12,
        marginBottom: 2,
        marginLeft: 5,
    },
    msg_body: {
        flex: 10,
        padding: 8,
        borderRadius: 10,
        maxWidth: 250,
    },
    text_field: {
        height: 40,
        flex: 8,
    },
    button_container: {
        flex: 2,
        alignSelf: 'center',
        alignItems: 'flex-end',
    },
    send_button_text: {
        color: '#0064e1',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
