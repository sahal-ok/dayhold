import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Auth({ onLogin }) {
  const [stage, setStage] = useState("choose"); // "choose" or "form"
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      onLogin(userCredential.user);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------- PAGE 1: Choose New User or Login ----------------
  if (stage === "choose") {
    return (
      <div className="auth-container">
        <h2>Welcome</h2>
        <button
          onClick={() => {
            setIsSignup(false);
            setStage("form");
          }}
          style={btnStyle}
        >
          Login
        </button>

        <button
          onClick={() => {
            setIsSignup(true);
            setStage("form");
          }}
          style={btnStyle}
        >
          New User
        </button>
      </div>
    );
  }

  // ---------------- PAGE 2: Show Form ----------------
  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isSignup ? "Create Account" : "Login"}</button>
      </form>

      {!isSignup && (
        <p
          onClick={handleForgotPassword}
          style={{ color: "blue", cursor: "pointer", marginTop: "5px" }}
        >
          Forgot Password?
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <p
        style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
        onClick={() => setStage("choose")}
      >
        ← Back
      </p>
    </div>
  );
}


// shared style
const btnStyle = {
  width: "30%",
  padding: "12px",
  margin: "10px 0",
  fontSize: "18px",
  cursor: "pointer",
};
