import { useEffect, useState } from "react";
import DashboardHero from "../components/Dashboard/DashboardHero";
import ProfileOverview from "../components/Dashboard/ProfileOverview";
import StatsCards from "../components/Dashboard/StatsCards";
import RecentRequests from "../components/Dashboard/RecentRequests";
import MySkills from "../components/Dashboard/MySkills";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const profileRes = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();

      const sentRes = await fetch("http://localhost:5000/api/requests/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sent = await sentRes.json();

      const receivedRes = await fetch("http://localhost:5000/api/requests/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const received = await receivedRes.json();

      setProfile(profileData);
      setStats({
        offered: profileData.skillsOffered?.length || 0,
        wanted: profileData.skillsWanted?.length || 0,
        sent: sent.length,
        received: received.filter(r => r.status === "pending").length,
      });
    };

    fetchDashboardData();
  }, [token]);

  if (!profile || !stats) return null;

  return (
    <>
      <DashboardHero name={profile.name} />
      <StatsCards stats={stats} />
      <RecentRequests />
      <MySkills />
      <ProfileOverview profile={profile} />
    </>
  );
};

export default Dashboard;
