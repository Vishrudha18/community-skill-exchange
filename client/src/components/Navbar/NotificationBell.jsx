import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔔 Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Notification fetch error", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token, fetchNotifications]);

  // 🔢 UNREAD COUNT (single source of truth)
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ✅ Mark all as read
  const markAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Update local state ONLY
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Mark read error", err);
    }
  };

  // 🔔 Toggle dropdown
  const toggleDropdown = async () => {
  if (!open) {
    setOpen(true);

    if (unreadCount > 0) {
      await markAsRead();
    }
  } else {
    setOpen(false);
  }
};

  // 🧠 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  setOpen(false);
}
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <div className="bell" onClick={toggleDropdown}>
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="dropdown">
          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p className="empty">No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                className={`item ${!n.isRead ? "unread" : ""}`}
                onClick={() => {
                  navigate(n.link || "/requests");
                  setOpen(false);
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
