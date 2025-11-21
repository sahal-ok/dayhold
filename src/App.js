import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CardGrid from "./components/CardGrid";
import BookingCalendar from "./components/BookingCalendar";
import Auth from "./components/Auth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { ref, get, set } from "firebase/database";
import './App.css'; // Import your CSS file
import BookingTable from "./components/BookingTable";


export default function App() {
  const [user, setUser] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("calendar");
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

    const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
if (user === undefined) {
  return null;                                  // NOTHING → no flicker
}
  if (!user) {
    return <Auth onLogin={() => setUser(auth.currentUser)} />;
  }




 return (
    <div className="app">
      
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <Sidebar menuOpen={menuOpen} 
              onLogout={handleLogout}
               auditoriumEmail={user?.email}
               />
   <div className="main" >
    <Topbar setView={setView} userEmail={user.email} />
   
     
     <div className="main">
 

  {view === "calendar" && <BookingCalendar setSelectedDate={setSelectedDate} auditoriumEmail={user.email} />}
  {view === "bookings" && <BookingTable  setView={setView} userEmail={user.email}/>}

</div>
 <CardGrid/>
   </div>
      
    </div>
  );

}
