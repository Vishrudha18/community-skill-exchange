import { FiCalendar, FiClock, FiSave } from "react-icons/fi";
import "./SessionSchedule.css";

/**
 * SessionSchedule
 * Pure presentational component for the "Schedule Learning Session" card.
 * All state (date/time) and the submit handler live in the parent —
 * this component only renders the styled inputs + button.
 *
 *   <SessionSchedule
 *     date={date}
 *     time={time}
 *     setDate={setDate}
 *     setTime={setTime}
 *     onSchedule={handleSchedule}
 *   />
 */
function SessionSchedule({ date, time, setDate, setTime, onSchedule }) {
  return (
    <div className="schedule-card">
      <div className="schedule-glow" aria-hidden="true" />

      <div className="schedule-card-header">
        <span className="schedule-icon-box">
          <FiCalendar />
        </span>
        <div>
          <h4>Schedule Learning Session</h4>
          <p className="schedule-subtitle">Pick a date and time for this session</p>
        </div>
      </div>

      <div className="schedule-inputs">
        <label className="schedule-field">
          <span className="schedule-field-icon">
            <FiCalendar />
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="schedule-field">
          <span className="schedule-field-icon">
            <FiClock />
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>

      <button className="schedule-save-btn" onClick={onSchedule}>
        <FiSave />
        Save Schedule
      </button>
    </div>
  );
}

/**
 * ScheduleWaiting
 * Pure presentational glass card shown to the non-teacher participant
 * while a session has no scheduledAt yet. No logic — just visuals.
 *
 *   <ScheduleWaiting />
 */
export function ScheduleWaiting() {
  return (
    <div className="schedule-waiting-card">
      <div className="schedule-glow" aria-hidden="true" />

      <span className="schedule-waiting-icon-box">
        <FiClock />
      </span>

      <div>
        <h4>Waiting for Schedule</h4>
        <p className="schedule-waiting-text">
          Your teacher hasn't scheduled this session yet. You'll be notified
          once a date and time are set.
        </p>
      </div>
    </div>
  );
}

export default SessionSchedule;
