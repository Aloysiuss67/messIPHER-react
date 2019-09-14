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
} from 'react-native';

import {chatClientService} from './services/chatClientService';


export default class ViewMessage extends React.Component {
    state = {newMessage: ''};

    inbox = [];

    newMessage = '';


    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('name'),
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
                this.setState(this.setState({newMessage: ''}));
                this.state.newMessage = '';
            });
        }
    }

    updateMessage = message => {
        this.setState({newMessage: message});
    };

    render() {
        const {refreshing = false} = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
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
                        <TextInput
                            style={styles.text_field}
                            multiline={true}
                            onChangeText={this.updateMessage}
                            value={this.state.newMessage}
                            placeholder="Aa"
                        />

                        <View style={styles.button_container}>
                            {
                                <TouchableOpacity onPress={() => this.sendMessage()}>
                                    <View style={styles.send_button}>
                                        <Text style={styles.send_button_text}>Send</Text>
                                    </View>
                                </TouchableOpacity>
                            }
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

        return (
            <View key={item.key} style={styles.msg}>
                {/*<View style={styles.msg_wrapper}>*/}
                <View style={styles.username}>
                    <Text style={[styles.username_text, styles[username_style]]}>
                        {this.props.navigation.getParam('name')}
                    </Text>
                </View>
                <View style={[styles.msg_body, styles[box_style]]}>
                    <Text style={styles[`${box_style}_text`]}>{item.message}</Text>
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
    leave_button: {
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
    },
    leave_button_text: {
        color: '#FFF',
        fontSize: 16,
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
    typing_indicator: {
        padding: 5,
    },
    typing_indicator_text: {
        fontSize: 10,
        color: '#ccc',
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
