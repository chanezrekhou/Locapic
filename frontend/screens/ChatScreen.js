import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button,  ListItem , Input, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
var socket = socketIOClient("http://172.17.1.97:3000");
import { connect } from 'react-redux';

function ChatScreen(props) {

  const [currentMessage, setCurrentMessage] = useState('')
  const [listMessage, setListMessage] = useState([]);
  useEffect(() => {

    socket.on('sendMessageToAll', (messageData) => {
      setListMessage([...listMessage, { message: messageData.message, pseudo: messageData.pseudo }]);
    });

  }, [listMessage]);



  var messageList = listMessage.map((element, i) => {
    console.log(element.pseudo, element.message);
    return (
      <View>
        <Avatar rounded source={require('../assets/Chanez.jpeg')} />
        <ListItem key={i} bottomDivider title={element.pseudo} subtitle={element.message} />
      </View>
    )
  }
  )

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={{ flex: 1, marginTop: 15 }}>
        {messageList}
      </ScrollView >

      <KeyboardAvoidingView behavior="padding" enabled>
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder='Your message'
          onChangeText={(val) => setCurrentMessage(val)}
          value={currentMessage}
        />
        <Button
          icon={
            <Icon
              name="envelope-o"
              size={20}
              color="#ffffff"
            />
          }
          title="Send"
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
          onPress={() => { socket.emit("sendMessage", { message: currentMessage, pseudo: props.pseudo }); setCurrentMessage('') }}
        />
      </KeyboardAvoidingView>

    </View>
  );
}

function mapStateToProps(state) {
  return { pseudo: state.pseudo }
}

export default connect(
  mapStateToProps,
  null
)(ChatScreen);
