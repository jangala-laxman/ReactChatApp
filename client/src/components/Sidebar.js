import React, {useEffect} from "react";
import data from '../data.json'
import socket from "../socket";

const Sidebar = (props) => {
  let userList = props.connectedUsers;
  userList = [...userList, ...data]

  
 
  let selectedUser = "";
  
  console.log("In sidebar userlist:", userList);
  
  const userName_from_click = (e) => {
    selectedUser = e.target.id;
    
    let selectedUserDetails = userList.find(
      (user) => user.username === selectedUser
    );
    
    socket.emit("update user" , selectedUserDetails)
    // console.log("In sidebar the user details:", selectedUserDetails);
    props.selectUser(selectedUserDetails);
    console.log("In sidebar the user details:", selectedUserDetails);
  };

  let showUsers = userList.map((user) => {
    
    return (
      <div
        key={user.key}
        className="user-list-el"
        id={user.username}
        onClick={(e) => userName_from_click(e)}
      >
          {user.username}
          {user.messages ? user.messages[0]: "null"}
         
      </div>
    );
  });

  useEffect(()=>{
    socket.on("update user", (user)=>{
      console.log(user)
    })

}, [props.connectedUsers ])

  console.log("Userlist in sidebar component:", userList);
  return <div>{showUsers}</div>;
};

export default Sidebar;
