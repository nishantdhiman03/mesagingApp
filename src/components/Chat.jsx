import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import cam from "../assets/images/cam.png";
import add from "../assets/images/add.png";
import more from "../assets/images/more.png";
import { ChatContext } from "../context/ChatContext";
const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chat__info">
        <div className="user">{data.user?.displayName}</div>
        <div className="icons">
          <img src={cam} alt="cam icon" />
          <img src={add} alt="add icon" />
          <img src={more} alt="more icon" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
