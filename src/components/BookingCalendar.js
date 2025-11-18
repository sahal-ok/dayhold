import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, set } from "firebase/database";
import "./BookingCalendar.css";

export default function BookingCalendar({ auditoriumEmail }) {
  const [calendarDays, setCalendarDays] = useState([]);
  const [lockedDates, setLockedDates] = useState([]);
  const [current, setCurrent] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [details, setDetails] = useState({ name: "", email: "", note: "" });
  const [confirmationMsg, setConfirmationMsg] = useState("");
const [viewBooking, setViewBooking] = useState(null);
  
  const safeEmail = auditoriumEmail.replace(/\./g, "_");
  const today = new Date();

  useEffect(() => {
    generateCalendar(current.year, current.month);
    fetchLockedDates();
  }, [current.year, current.month, safeEmail]);
if (!auditoriumEmail) return <div>Please provide an auditorium email.</div>;
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const tempDays = [];
    for (let i = 0; i < startDay; i++) tempDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) tempDays.push(d);
    setCalendarDays(tempDays);
  };

  const fetchLockedDates = async () => {
    try {
      const snapshot = await get(ref(db, `bookings/${safeEmail}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLockedDates(Object.keys(data));
      } else {
        setLockedDates([]);
      }
    } catch (err) {
      console.error("Error fetching locked dates:", err);
    }
  };

  //popup details
const fetchBookingDetails = async (dateKey) => {
  try {
    const snapshot = await get(ref(db, `bookings/${safeEmail}/${dateKey}`));
    if (snapshot.exists()) {
      setViewBooking({
        date: dateKey,
        ...snapshot.val()
      });
    }
  } catch (error) {
    console.error("Error loading booking info:", error);
  }
};

  const selectDate = (day) => {
    if (!day) return;
    const monthStr = String(current.month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateKey = `${current.year}-${monthStr}-${dayStr}`;
    if (lockedDates.includes(dateKey)){
  fetchBookingDetails(dateKey);
  return;
}// already booked
    setSelectedDate(dateKey);
    setStep(2);
  };

  const goToPrevMonth = () => {
    setCurrent((prev) => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const goToNextMonth = () => {
    setCurrent((prev) => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const handleNext = async () => {
    if (step === 2 && !selectedPackage) return alert("Please select a package.");
    if (step === 3) {
      if (!details.name || !details.phoneNumber) return alert("Please fill all details.");
      try {
        const bookingRef = ref(db, `bookings/${safeEmail}/${selectedDate}`);
        await set(bookingRef, {
          package: selectedPackage,
          name: details.name,
          phoneNumber: details.phoneNumber,
          note: details.note,
          confirmedAt: new Date().toISOString(),
        });
        setLockedDates((prev) => [...prev, selectedDate]);
        setConfirmationMsg(`✅ Booking confirmed for ${selectedDate} (${selectedPackage}) by ${details.name}`);
        setStep(4);
      } catch (err) {
        console.error("Error saving booking:", err);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="booking-container">
      {/* Step Indicator */}
      <div className="steps">
        <div className={`step ${step === 1 ? "active" : ""}`}><div className="step-number">1</div><div>Select Date</div></div>
        <div className={`step ${step === 2 ? "active" : ""}`}><div className="step-number">2</div><div>Choose Package</div></div>
        <div className={`step ${step === 3 ? "active" : ""}`}><div className="step-number">3</div><div>Fill Details</div></div>
        <div className={`step ${step === 4 ? "active" : ""}`}><div className="step-number">4</div><div>Confirmation</div></div>
      </div>

      {/* Step 1: Calendar */}
      {step === 1 && (
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="nav-btn" onClick={goToPrevMonth}>◀</button>
            <h2>
              {new Date(current.year, current.month).toLocaleString("default", { month: "long" })} {current.year}
            </h2>
            <button className="nav-btn" onClick={goToNextMonth}>▶</button>
          </div>

          <div className="calendar-grid">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="weekday">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} className="day empty"></div>;
              const dateKey = `${current.year}-${String(current.month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isLocked = lockedDates.includes(dateKey);
              const isToday = today.getDate()===day && today.getMonth()===current.month && today.getFullYear()===current.year;
              return (
                <div
                  key={i}
                  className={`day ${isToday ? "today" : ""} ${isLocked ? "locked" : ""}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Packages */}
      {step === 2 && (
        <div className="packages">
          {["Silver", "Gold", "Platinum"].map((pkg) => (
            <div
              key={pkg}
              className={`package-card ${selectedPackage === pkg ? "selected" : ""}`}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg} Package - ₹{pkg === "Silver" ? "5,000" : pkg === "Gold" ? "10,000" : "20,000"}
            </div>
          ))}
          <div className="next-btn"><button onClick={() => setStep(3)}>Next</button></div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="details">
          <input type="text" placeholder="Your Name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
          <input type="number" placeholder="phoneNumber" value={details.phoneNumber} onChange={(e) => setDetails({ ...details, phoneNumber: e.target.value })} />
          <textarea placeholder="Special Requests" value={details.note} onChange={(e) => setDetails({ ...details, note: e.target.value })}></textarea>
          <div className="next-btn"><button onClick={handleNext}>Submit</button></div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="confirmation">
          <h2>{confirmationMsg}</h2>
          <button onClick={() => { 
      setStep(1); 
      setSelectedDate(null); 
      setSelectedPackage(""); 
      setDetails({ name: "", phoneNumber: "", note: "" }); 
      setConfirmationMsg(""); 
    }}>
      🔙 Back to Calendar
    </button>
        </div>
      )}

      {/* pop up details */}
      {viewBooking && (
  <div className="booking-popup">
    <div className="popup-content">

      <h2>Booking Details</h2>
      <p><strong>Date:</strong> {viewBooking.date}</p>
      <p><strong>Name:</strong> {viewBooking.name}</p>
      <p><strong>Phone Number:</strong> {viewBooking.phoneNumber}</p>
      <p><strong>Package:</strong> {viewBooking.package}</p>
      <p><strong>Note:</strong> {viewBooking.note || "None"}</p>
      <p><strong>Confirmed:</strong> {new Date(viewBooking.confirmedAt).toLocaleString()}</p>
     

      {/* WhatsApp button */}
      <button
        style={{ background: "#25D366", color: "white", padding: "10px", marginTop: "10px" }}
        onClick={() => {
          const phone = viewBooking.phoneNumber;
          const message = `Hello ${viewBooking.name}, your program is confirmed on ${viewBooking.date}.`;
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(url, "_blank");
        }}
      >
        WhatsApp
      </button>

      
      <button onClick={() => setViewBooking(null)}>Close</button>
    </div>
  </div>
)}

    </div>
  );
}
