import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

import "./LogIn.scss";
const LogIn = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(true);
    }
  }
  return (
    <div className="login">
      {/* To login existing user*/}
      <div className="login__form--container">
        <h1 className="logo">We Chat</h1>
        <span>Log In</span>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Log In</button>
          <p>
            Don't have an account? <Link to={"/register"}>Register</Link>{" "}
          </p>
          {error && <span>something went wrong</span>}
        </form>
      </div>
    </div>
  );
};

export default LogIn;
