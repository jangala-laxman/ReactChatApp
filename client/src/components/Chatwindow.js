import React, { useState } from "react";
import socket from "../socket";

const Chatwindow = (props) => {
  let selectedUser = {
    ...props.selectedUser,
  };

  const [messages, setMessages] = useState([]);
  console.log("Selected user object chatwindow compo:", selectedUser.messages);

  let messageContent = "";
  let ref; //Reference to the input field so that it gets cleared every time we submit
  const getContent = (e) => {
    messageContent = e.target.value;
    ref = e;
  };

  const onMessage = (e, content) => {
    e.preventDefault();
    console.log("Message is:", content);
    ref.target.value = "";
    if (props.selectedUser) {
      socket.emit("private message", {
        content,
        to: props.selectedUser.userID,
      });
      setMessages((messages) => [
        ...messages,
        { toUser: props.selectedUser.username, content, fromSelf: true },
      ]);
    }
    console.log("Message object", messages);
  };

  socket.on("private message", ({ content, from }) => {
    console.log(props.connectedUsers);
    let newMessages = {};
    for (let i = 0; i < props.connectedUsers.length; i++) {
      const user = props.connectedUsers[i];
      if (user.userID === from) {
        console.log("Iteration:", i);
        newMessages = {
          fromUser: props.connectedUsers[i].username,
          content,
          fromSelf: false,
        };      

        const messagesList = [...messages, newMessages];
        console.log(user.messages)
        setMessages(messagesList);

        if(props.connectedUsers[i].messages){
          props.connectedUsers[i].messages.push(newMessages, ...messages)
        }
        else{
          props.connectedUsers[i].messages = [];
          props.connectedUsers[i].messages.push(newMessages)
        }

      }
    }
  });



  const showMessages = messages.map((message, index) => {
    if (
      message.fromSelf === true &&
      message.toUser === props.selectedUser.username
    )
      return (
        <div
          key={index}
          style={{ textAlign: "right" }}
          className="message-ribbon"
        >
          <strong></strong>{message.content}
        </div>
      );
    if (
      message.fromSelf === false &&
      message.fromUser === props.selectedUser.username
    )
      return (
        <div
          key={index}
          style={{ textAlign: "left" }}
          className="message-ribbon"
        >
          {message.content}
        </div>
      );
  });

  socket.on("new-notification", (data)=>{
    // toastr.success(data,'Message')
    alert(`message ${data}` )
    console.log(`message ${data}`)
  })


  console.log(showMessages);
  console.log("In chatwindow selected user:", props.selectedUser);
  return (
    <div className="chat-window">
      <div className="user-name-card">
        <p>{props.selectedUser.username}</p>
      </div>

      <div className="message-container">{showMessages}</div>
      <form onSubmit={(e) => onMessage(e, messageContent)}>
        <input
          className="chat-text-area"
          placeholder="Enter message to send"
          onChange={(e) => getContent(e)}
        ></input>
      </form>
    </div>
  );
};


export default Chatwindow;
