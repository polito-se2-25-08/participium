import React, { useState } from "react";

import { setupUser } from "../../api/adminService";
export function AccountSetupPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    role: "",
    email: "",
  });

  const [password, setPassword] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const password = await setupUser(formData);
      setPassword(password);
    } catch (error) {
      console.error("Error setting up user:", error);
    }
  };

  return (
    <div className="home-page">
      <div className="main-content">
        <div className="setup-form-section">
          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Surname:</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select a role...</option>
                <option value="OFFICER">Officer</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Create Account
            </button>
          </form>

          {password && (
            <div className="password-display">
              <h2>Generated Password</h2>
              <div className="password-box">
                <code>{password}</code>
              </div>
              <p className="password-note">
                Please save this password securely. It will not be shown again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSetupPage;
