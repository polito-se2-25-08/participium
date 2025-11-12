import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Participium!</h1>
      <p>
        Your city, your voice — Help keep Turin clean and efficient by reporting
        issues you see around you. Just select a spot on the map, add a short
        description and photo, and send your report to the municipality.
      </p>
      <div className="home-buttons">
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
}
