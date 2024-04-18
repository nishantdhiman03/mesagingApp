import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const Chats = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const fetchUsers = () => {
      const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
        console.log("inside snapshot");
        setChats(Object.entries(doc.data()));
      });
      return () => {
        unsub();
      };
    };
    user.uid && fetchUsers();
  }, [user.uid]);
  console.log(chats, " From chats");

  function handleSelect(userInfo) {
    dispatch({
      type: "CHANGE__USER",
      payload: userInfo,
    });
  }
  return (
    <div className="chats">
      {chats
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          return (
            <div
              className="chat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="user image" />
              <div className="chat__user--info">
                <span className="name">{chat[1].userInfo.displayName}</span>
                <span className="last__message">{chat[1].message?.text}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
