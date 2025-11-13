import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import './BookingTable.css'
export default function BookingTable({ setView, userEmail }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userEmail) return;

      // Firebase keys can't have ".", so replace it with "_"
      const safeEmail = userEmail.replace(/\./g, "_");

      try {
        const snapshot = await get(ref(db, `bookings/${safeEmail}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const bookingsArray = Object.entries(data).map(([date, details]) => ({
            id: `${safeEmail}-${date}`,
            date,
            ...details,
          }));

          setBookings(bookingsArray);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userEmail]);

  return (
    <div className="booking-table">
      <h2>📅 My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Package</th>
              <th>Note</th>
              <th>Confirmed At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>{b.name || "N/A"}</td>
                <td>{b.email || "N/A"}</td>
                <td>{b.package || "N/A"}</td>
                <td>{b.note || "-"}</td>
                <td>
                  {b.confirmedAt
                    ? new Date(b.confirmedAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={() => setView("calendar")}>
        ⬅ Back to Calendar
      </button>
    </div>
  );
}
