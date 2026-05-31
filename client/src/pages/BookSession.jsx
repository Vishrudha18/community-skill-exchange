import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function BookSession() {
  const { teacherId } = useParams();
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const fetchAvailability = useCallback(async () => {
  const res = await axios.get(`/api/availability/${teacherId}`);
  setAvailability(res.data);
}, [teacherId]);

useEffect(() => {
  fetchAvailability();
}, [fetchAvailability]);

  const bookSlot = async (day, slot) => {
    if (!selectedDate) {
      alert("Select a date first");
      return;
    }

    try {
      await axios.post("/api/sessions/book", {
        teacherId,
        day,
        slotStart: slot.startTime,
        slotEnd: slot.endTime,
        date: selectedDate,
      });

      alert("Session booked successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const fetchBookedSlots = async (date) => {
  if (!date) return;

  const res = await axios.get(
    `/api/sessions/booked-slots?teacherId=${teacherId}&date=${date}`
  );

  setBookedSlots(res.data);
};

const isSlotBooked = (slot) => {
  return bookedSlots.some(
    (s) =>
      s.slotStart === slot.startTime &&
      s.slotEnd === slot.endTime
  );
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book Session</h2>

      <input
  type="date"
  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    fetchBookedSlots(e.target.value);
  }}
/>

      {availability.map((dayData) => (
        <div key={dayData.day} style={{ marginTop: "20px" }}>
          <h3>{dayData.day}</h3>

          {dayData.slots.map((slot, i) => {
  const booked = isSlotBooked(slot);

  return (
    <button
      key={i}
      disabled={booked}
      onClick={() => !booked && bookSlot(dayData.day, slot)}
      style={{
        margin: "5px",
        padding: "10px",
        cursor: booked ? "not-allowed" : "pointer",
        backgroundColor: booked ? "#ccc" : "#4CAF50",
        color: booked ? "#666" : "#fff",
      }}
    >
      {slot.startTime} - {slot.endTime}
      {booked && " (Booked)"}
    </button>
  );
})}
        </div>
      ))}
    </div>
  );
}

export default BookSession;