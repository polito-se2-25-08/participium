import { useState } from "react";
import { registerUser } from "../api/userService";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    surname: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerUser(form);
      setMessage("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={handleChange}
          />
        ))}
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
