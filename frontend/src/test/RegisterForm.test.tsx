import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "../components/RegisterForm";
import { registerUser } from "../api/userService";

vi.mock("../api/userService");

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders inputs and button", () => {
    render(<RegisterForm />);
    ["email", "username", "password", "name", "surname"].forEach((field) => {
      expect(screen.getByPlaceholderText(field)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("submits successfully", async () => {
    (registerUser as any).mockResolvedValueOnce({});

    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("username"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText("name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("surname"), { target: { value: "Doe" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(
        screen.getByText("Registration successful! You can now log in.")
      ).toBeInTheDocument();
    });
  });

  it("shows error when registration fails", async () => {
    (registerUser as any).mockRejectedValueOnce(new Error("User already exists"));

    render(<RegisterForm />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });
});
