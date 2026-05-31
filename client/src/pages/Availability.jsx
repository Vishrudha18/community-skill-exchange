import { useState } from "react";
import axios from "axios";
import "./Availability.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Availability() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const addSlot = () => {
    if (!startTime || !endTime) return;

    setSlots([...slots, { startTime, endTime }]);
    setStartTime("");
    setEndTime("");
  };

  const saveAvailability = async () => {
    await axios.post("/api/availability", {
      day: selectedDay,
      slots,
    });
    alert("Availability saved!");
  };

  return (
    <div className="availability-container">
      <h2>Set Your Availability</h2>

      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        {days.map((day) => (
          <option key={day}>{day}</option>
        ))}
      </select>

      <div className="time-inputs">
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <button onClick={addSlot}>Add Slot</button>
      </div>

      <ul>
        {slots.map((slot, i) => (
          <li key={i}>{slot.startTime} - {slot.endTime}</li>
        ))}
      </ul>

      <button className="save-btn" onClick={saveAvailability}>
        Save Availability
      </button>
    </div>
  );
}

export default Availability;