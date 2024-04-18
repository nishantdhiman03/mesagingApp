import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, collection, doc } from "firebase/firestore";
import { auth, storage, db } from "../../firebase";

import img from "../../assets/images/addAvatar.png";
import "./Register.scss";
const Register = () => {
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    console.log(displayName, email, password);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          console.log("inside snapshot");
        },
        (error) => {
          // Handle errors
          console.log(error);
          setError(true);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("URL of download", downloadURL);
            updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });
            const docRef = await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            const userChats = await setDoc(
              doc(db, "userChats", response.user.uid),
              {}
            );
            console.log("doc id", docRef.id);
            console.log("userChats id", userChats.id);
          });
        }
      );
      navigate("/login");
    } catch (error) {
      console.log("regiister", error);
      setError(true);
    }
  }
  return (
    <div className="register">
      <div className="register__form--container">
        <h1 className="logo">We Chat</h1>
        <span>Register</span>
        <form onSubmit={handleSubmit}>
          {/* Register new user */}
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            placeholder="Enter your name"
          />

          <input
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your email"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
          <input
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
          <label htmlFor="file" className="file__label">
            <img src={img} alt="add avatar" />
            <span>Add a Avatar</span>
          </label>
          <button type="submit">Register</button>
          <p>
            Already have an account? <Link to={"/login"}>Log In</Link>{" "}
          </p>
        </form>
        {error && <span>Something went wrong</span>}
      </div>
    </div>
  );
};

export default Register;
