import React, { useContext, useState, useTransition } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [userName, setUserName] = useState("");
  const [searchedUser, setSearchedUser] = useState();

  const { user } = useContext(AuthContext);

  const collectionRef = collection(db, "users");
  // Store user name search
  function handleChange(e) {
    console.log(e.target.value);
    setUserName(e.target.value);
  }

  // Search user on enter key press
  async function handleKeyDown(e) {
    console.log(e.code);
    try {
      if (e.code === "Enter") {
        const q = query(collectionRef, where("displayName", "==", userName));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setSearchedUser(doc.data());
          console.log(searchedUser);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // To make chats collection onClick
  async function handleClick() {
    const combinedId =
      searchedUser.uid > user.uid
        ? searchedUser.uid + user.uid
        : user.uid + searchedUser.uid;
    try {
      const docRef = doc(db, "chats", combinedId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const chatDocRef = await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
        // update the userchats to include that person
        const userChatRef1 = doc(db, "userChats", user.uid);
        const userChatRef2 = doc(db, "userChats", searchedUser.uid);
        await updateDoc(userChatRef1, {
          [combinedId + ".userInfo"]: {
            uid: searchedUser.uid,
            displayName: searchedUser.displayName,
            photoURL: searchedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(userChatRef2, {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        console.log("chats group exist");
      }
    } catch (err) {
      console.log(err);
    }
    setUserName("");
    setSearchedUser(null);
  }

  return (
    <div className="search">
      <div className="search__input">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search..."
          autoComplete="off"
          value={userName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {searchedUser && (
        <div className="search__user" onClick={handleClick}>
          <img src={searchedUser.photoURL} alt="user image" />
          <div className="search__user--info">
            <span className="name">{searchedUser.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
