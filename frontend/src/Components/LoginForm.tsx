import { useState } from "react";
import { loginUser } from "../api/userService.ts";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await loginUser({ username, password });
      setMessage(`Welcome ${result.data.username}!`);
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
      <h2>Login</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}
