import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Profile } from "../../components/Profile";
import { getProfile } from "../../api/userService";

vi.mock("../../api/userService");

describe("Integration: Profile loading", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and displays profile successfully", async () => {
    (getProfile as any).mockResolvedValueOnce({
      user: { username: "Alice", email: "alice@mail.com", id: 101 },
    });

    render(<Profile />);
    fireEvent.click(screen.getByRole("button", { name: /load profile/i }));

    await waitFor(() => {
      expect(getProfile).toHaveBeenCalled();
      expect(screen.getByText("Username:")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("alice@mail.com")).toBeInTheDocument();
      expect(screen.getByText("101")).toBeInTheDocument();
    });
  });

  it("shows error when profile fetch fails", async () => {
    (getProfile as any).mockRejectedValueOnce(new Error("Token expired"));

    render(<Profile />);
    fireEvent.click(screen.getByRole("button", { name: /load profile/i }));

    await waitFor(() => {
      expect(screen.getByText("Token expired")).toBeInTheDocument();
    });
  });
});
