import { useState } from "react";
import { getProfile } from "../api/userService";

export function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleLoadProfile() {
    try {
      const result = await getProfile();
      setProfile(result.user);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={{ width: "300px" }}>
      <h2>Profile</h2>
      <button onClick={handleLoadProfile}>Load Profile</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {profile && (
        <div style={{ marginTop: "1em" }}>
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>ID:</b> {profile.id}</p>
        </div>
      )}
    </div>
  );
}
