import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Profile } from "../components/Profile";
import { getProfile } from "../api/userService";

vi.mock("../api/userService");

describe("Profile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header and button", () => {
    render(<Profile />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load profile/i })).toBeInTheDocument();
  });

  it("loads and displays profile on success", async () => {
    (getProfile as any).mockResolvedValueOnce({
      user: { username: "john", email: "john@mail.com", id: 1 },
    });

    render(<Profile />);
    fireEvent.click(screen.getByRole("button", { name: /load profile/i }));

    await waitFor(() => {
      expect(screen.getByText("Username:")).toBeInTheDocument();
      expect(screen.getByText("john")).toBeInTheDocument();
      expect(screen.getByText("john@mail.com")).toBeInTheDocument();
    });
  });

  it("shows error on API failure", async () => {
    (getProfile as any).mockRejectedValueOnce(new Error("Network error"));

    render(<Profile />);
    fireEvent.click(screen.getByRole("button", { name: /load profile/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});
