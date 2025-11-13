import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./ProfilePage.css";


//Admin : admDom pass: Ud5S4*9MPe

export function ProfilePage() {
  const { user, logout, loading, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !token)) {
      navigate("/login");
    }
  }, [user, token, loading, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <p><b>ID:</b> {user.id}</p>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>
      <button className="logout-button" onClick={logout}>Logout</button><br/>
      {user.role === "ADMIN" && (
        <button className="setup-button" onClick={() => navigate("/setup")}>Setup an account</button>
      )}
    </div>
  );
}
