import React from "react";

export default function Topbar({ setView,userEmail }) {
  return (
    <div className="topbar">
      <h1>Dashboard Overview</h1>
      
     <div className="topbar-buttons"> <div>
        <button onClick={() => setView("calendar")}>Calendar</button>
        <button onClick={() => setView("bookings")}>View Bookings</button>
      </div>
      <div className="profile">
        <span>Admin:{userEmail}</span>
        <img src="https://i.pravatar.cc/40" alt="Admin Profile" />
      </div>
</div>
    </div>
  );
}
