import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "../../components/RegisterForm";
import { LoginForm } from "../../components/LoginForm";
import { registerUser, loginUser } from "../../api/userService";

vi.mock("../../api/userService");

describe("Integration: Register + Login Flow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("registers then logs in successfully", async () => {
    // Mock backend responses
    (registerUser as any).mockResolvedValueOnce({});
    (loginUser as any).mockResolvedValueOnce({ data: { username: "Bob" } });

    // --- REGISTER ---
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "bob@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("username"), { target: { value: "Bob" } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText("name"), { target: { value: "Bob" } });
    fireEvent.change(screen.getByPlaceholderText("surname"), { target: { value: "Smith" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(
        screen.getByText("Registration successful! You can now log in.")
      ).toBeInTheDocument();
    });

    // --- LOGIN ---
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "Bob" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "12345" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
      expect(screen.getByText("Welcome Bob!")).toBeInTheDocument();
    });
  });

  it("shows error when registration fails", async () => {
    (registerUser as any).mockRejectedValueOnce(new Error("User already exists"));
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => expect(screen.getByText("User already exists")).toBeInTheDocument());
  });

  it("shows error when login fails", async () => {
    (loginUser as any).mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "Bob" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
  });
});
