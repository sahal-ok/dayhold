import React from "react";

export default function CardGrid() {
  return (
    <div className="card-grid">
      <div className="card"><h3>Today's Events</h3><p>4 scheduled</p></div>
      <div className="card"><h3>Total Events</h3><p>24 this month</p></div>
      <div className="card"><h3>Payments</h3><p>₹12,450 received</p></div>
      <div className="card"><h3>Pending</h3><p>2 payments</p></div>
    </div>
  );
}
