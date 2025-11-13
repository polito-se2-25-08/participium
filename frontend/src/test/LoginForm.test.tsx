import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/LoginForm";
import { loginUser } from "../api/userService";

vi.mock("../api/userService");

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders inputs and button", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows welcome message on successful login", async () => {
    (loginUser as any).mockResolvedValueOnce({ data: { username: "Alice" } });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "12345" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
      expect(screen.getByText("Welcome Alice!")).toBeInTheDocument();
    });
  });

  it("shows error message on failed login", async () => {
    (loginUser as any).mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
