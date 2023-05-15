import React, { useState } from "react";
import Chatwindow from "./Chatwindow";
import Sidebar from "./Sidebar";
import contacts from '../data.json'

const Home = (props) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [userSelected, setUserSelected] = useState(false); //So that any chat window is not rendered when app is loaded
  const [value, setValue] = useState('');
  const [addvalue, setAddValue] = useState('');
  const [createuser, setCreateUser] = useState(false)

  console.log("in home", props.connectedUsers);

  const getSelectedUser = (user) => {
    setSelectedUser(user);
    setUserSelected(true);
    console.log("In home, selected user:", user);
  };

  const onChange = (event)=>{
    setValue(event.target.value)
  }

  const onAddContact = (event)=>{
    setAddValue(event.target.value)
  }

  const onSearch = (searchItem)=>{
    setValue(searchItem)
  }

  const addnewUser = ()=>{
    contacts.forEach((item)=>{
      if(item.username === addvalue){
        setSelectedUser(item)
        setUserSelected(true);
      }
    })
  }


  return (
    <div className="chat-container">
      
      <div className="users">     
        <div className="user-card">          
          <input type="text" name="search" value={value} className="search" placeholder="Search" onChange={onChange} />
          <div  className="addContact" onClick={()=>{setCreateUser(!createuser)}}>+</div>
          { createuser && (
            <div className="add_dropdown">
              <input type="text" placeholder="add user" value={addvalue} onChange={onAddContact} /><button onClick={addnewUser}><a href="https://reactchatappclientfront.onrender.com" target="blank">add</a></button>
              <div className="dropdown2">
                {contacts.filter(item=>{
                  const searchItem = value.toLocaleLowerCase()
                  const uname= item.username.toLocaleLowerCase()
                  return searchItem && uname.startsWith(searchItem) && uname !== searchItem
                })
                .map((data, index)=>{
                  return(
                    <div key={index} onClick={()=>{onSearch(data.username)}} selectUser={getSelectedUser} className="dropdown-row2">
                      {data.username}
                    </div>
                   )
                  })}
                </div>
               </div>)
          }
          <div className="dropdown">
            {contacts.filter(item=>{
              const searchItem = value.toLocaleLowerCase()
              const uname= item.username.toLocaleLowerCase()
              return searchItem && uname.startsWith(searchItem) && uname !== searchItem
            })
            .map((data, index)=>{
              return(
                <div key={index} onClick={()=>onSearch(data.username)} className="dropdown-row">
                  {data.username}
                </div>
              )
            })}
          </div>
        </div>
        <div className="user-list"></div>
        <Sidebar
          connectedUsers={props.connectedUsers}
          selectUser={getSelectedUser}
        />
      </div>
      {userSelected ? (
        <div>
          <Chatwindow
            selectedUser={selectedUser}
            connectedUsers={props.connectedUsers}
          />
        </div>
      ) : (
        <div className="no-render-message">Click chat to start messaging</div>
      )}
    </div>
  );
};

export default Home;
