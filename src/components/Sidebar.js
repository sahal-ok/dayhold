import React from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";

export default function Sidebar({ menuOpen, onLogout, auditoriumEmail, setBookings }) {
  const handleViewEvents = async () => {
    if (!auditoriumEmail) {
      alert("No user email found!");
      return;
    }

    const safeEmail = auditoriumEmail.replace(/\./g, "_");

    try {
      const snapshot = await get(ref(db, `bookings/${safeEmail}`));
      if (!snapshot.exists()) {
        setBookings([]);
        
        return;
      }

      const data = snapshot.val();
      const bookingsList = Object.entries(data).map(([date, info]) => ({
        date,
        name: info.name,
        email: info.email,
        package: info.package,
      }));

      setBookings(bookingsList);
      
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  return (
    <div className={`sidebar ${menuOpen ? "active" : ""}`}>
      <h2>🌟 Admin</h2>
      <div className="nav">
        <button onClick={handleViewEvents}>View Events</button>
        <a href="#">Payments</a>
        <a href="#">Settings</a>
        
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      
      <button 
        onClick={() => {
          const customerEmail = prompt("Enter customer email:");
          if (!customerEmail) return;
        }}
      >
        Share Calendar
      </button>
    </div>
  );
}
