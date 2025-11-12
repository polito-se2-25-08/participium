import { useState } from "react";
import { registerUser } from "../api/userService.ts";

export function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    surname: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerUser(form);
      setMessage("Registration successful! You can now log in.");
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
      <h2>Register</h2>
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
      {message && <p>{message}</p>}
    </form>
  );
}
