import registerLoginFeature from "../../src/featuresBot/login";
import axios from "axios";

// Explicit axios mock
jest.mock("axios", () => ({
  post: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("login feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createMockCtx(text: string, session: any = {}) {
    return {
      message: { text },
      chat: { id: 123 },
      session,
      reply: jest.fn(),
    } as any;
  }

  it("logs in successfully", async () => {
    let loginHandler!: Function;
    let textHandler!: Function;

    const fakeBot = {
      command: jest.fn((cmd, h) => cmd === "login" && (loginHandler = h)),
      on: jest.fn((evt, h) => evt === "text" && (textHandler = h)),
    } as any;

    registerLoginFeature(fakeBot);

    const session: any = {};

    await loginHandler(createMockCtx("/login", session));
    await textHandler(createMockCtx("Alice", session), jest.fn());

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          token: "fake-token",
          user: { id: 1 },
        },
      },
    } as any);

    await textHandler(createMockCtx("Secret123!", session), jest.fn());

    expect(session.token).toBe("fake-token");
    expect(session.id).toBe(1);
    expect(session.loginState).toBeNull();
  });

  it("fails login with wrong password", async () => {
    let loginHandler!: Function;
    let textHandler!: Function;

    const fakeBot = {
      command: jest.fn((cmd, h) => cmd === "login" && (loginHandler = h)),
      on: jest.fn((evt, h) => evt === "text" && (textHandler = h)),
    } as any;

    registerLoginFeature(fakeBot);

    const session: any = {};

    await loginHandler(createMockCtx("/login", session));
    await textHandler(createMockCtx("Alice", session), jest.fn());

    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    const ctxPassword = createMockCtx("WrongPassword", session);

    await textHandler(ctxPassword, jest.fn());

    expect(ctxPassword.reply).toHaveBeenCalledWith("Invalid credentials");
  });
});
