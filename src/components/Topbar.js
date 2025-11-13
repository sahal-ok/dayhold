import React from "react";

export default function Topbar({ setView }) {
  return (
    <div className="topbar">
      <h1>Dashboard Overview</h1>
      
      <div className="topbar-buttons">
        <button onClick={() => setView("calendar")}>Calendar</button>
        <button onClick={() => setView("bookings")}>View Bookings</button>
      </div>
      <div className="profile">
        <span>Admin</span>
        <img src="https://i.pravatar.cc/40" alt="Admin Profile" />
      </div>

    </div>
  );
}
