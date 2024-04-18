import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  // console.log("message ", message);
  console.log("date");
  console.log("date");
  console.log("date");
  const date = new Date(message.data.seconds * 1000).getDate();
  const month = new Date(message.data.seconds * 1000).getMonth();
  const year = new Date(message.data.seconds * 1000).getFullYear();

  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);
  return (
    <div
      className={message.senderId == user.uid ? "message owner" : "message"}
      ref={ref}
    >
      <div className="message__info">
        <img
          src={
            message.senderId == user.uid ? user.photoURL : data.user.photoURL
          }
          alt="user image"
        />
        <span className="message__time">{date + "-" + month + "-" + year}</span>
      </div>

      <div className="message__content">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="message image" />}
      </div>
    </div>
  );
};

export default Message;
