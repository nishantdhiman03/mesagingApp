import React, { useContext, useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import attach from "../assets/images/attach.png";
import image from "../assets/images/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState("");

  const { user } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  async function handleSend() {
    const sendRef = doc(db, "chats", data.chatId);
    try {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion

      if (!img) {
        await updateDoc(sendRef, {
          messages: arrayUnion({
            senderId: user.uid,
            data: Timestamp.now(),
            id: uuid(),
            text: text,
          }),
        });
      } else {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            console.log("Inside input snapshot");
          },
          (error) => {
            // Handle errors
            console.log("Input snapshot upload error", error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(sendRef, {
                  messages: arrayUnion({
                    senderId: user.uid,
                    data: Timestamp.now(),
                    id: uuid(),
                    text: text,
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      }

      await updateDoc(doc(db, "userChats", user.uid), {
        [data.chatId + ".message"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".message"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      setImg("");
      setText("");
    } catch (error) {
      console.log("Input error ", error);
    }
  }

  return (
    <div className="input">
      <div className="chat__input">
        <input
          type="text"
          name="chat"
          id="chat "
          placeholder="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        <label htmlFor="attach">
          <input
            style={{ display: "none" }}
            type="file"
            name="attach"
            id="attach"
            // defaultValue={img}
            onChange={(e) => setImg(e.target.files[0])}
          />
          <img src={attach} alt="attach doc" />
        </label>
        <label htmlFor="addimg">
          <input
            style={{ display: "none" }}
            type="file"
            name="addimg"
            id="addimg"
          />
          <img src={image} alt="attach doc" />
        </label>
        <button className="send__btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
