import checkReports from "../../src/featuresBot/checkReports";
import axios from "axios";

// Explicit axios mock
jest.mock("axios", () => ({
  get: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("checkReports feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createMockCtx(text: string, session: any) {
    return {
      message: { text },
      chat: { id: 123 },
      session,
      reply: jest.fn(),
    } as any;
  }

  it("handles /myreports correctly", async () => {
    let myReportsHandler!: Function;

    const fakeBot = {
      command: jest.fn((command, handler) => {
        if (command === "myreports") myReportsHandler = handler;
      }),
      catch: jest.fn(),
    } as any;

    checkReports(fakeBot);

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 44, title: "Broken streetlight", status: "OPEN" }],
      },
    } as any);

    const ctx = createMockCtx("/myreports", {
      id: 1,
      token: "fake-token",
    });

    await myReportsHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(
      "📋 Here is the list of your reports:"
    );

    expect(ctx.reply).toHaveBeenCalledWith(
      "📄 Report #44: Broken streetlight\n📊 Status: OPEN"
    );
  });

  it("handles /reportstatus 44 correctly", async () => {
    let reportStatusHandler!: Function;

    const fakeBot = {
      command: jest.fn((command, handler) => {
        if (command === "reportstatus") reportStatusHandler = handler;
      }),
      catch: jest.fn(),
    } as any;

    checkReports(fakeBot);

    mockedAxios.get
      // Report fetch
      .mockResolvedValueOnce({
        data: {
          data: {
            id: 44,
            title: "Broken streetlight",
            status: "IN_PROGRESS",
          },
        },
      } as any)
      // Notifications fetch
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              report_id: 44,
              message: "Technician assigned",
              created_at: "2024-01-01T10:00:00Z",
            },
          ],
        },
      } as any);

    const ctx = createMockCtx("/reportstatus 44", {
      id: 1,
      token: "fake-token",
    });

    await reportStatusHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(
      "📄 Report #44: Broken streetlight\n📊 Status: IN_PROGRESS"
    );

    expect(ctx.reply).toHaveBeenCalledWith(
      "📢 Recent updates for this report:"
    );

    expect(ctx.reply).toHaveBeenCalledWith(
      expect.stringContaining("Technician assigned")
    );
  });

  it("fails when report ID does not exist (111111)", async () => {
    let reportStatusHandler!: Function;

    const fakeBot = {
      command: jest.fn((command, handler) => {
        if (command === "reportstatus") reportStatusHandler = handler;
      }),
      catch: jest.fn(),
    } as any;

    checkReports(fakeBot);

    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { message: "Report not found" },
      },
    });

    const ctx = createMockCtx("/reportstatus 111111", {
      id: 1,
      token: "fake-token",
    });

    await reportStatusHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(
      "❌ Sorry, I couldn't fetch the report details. Please check the report ID and try again."
    );
  });

  it("fails when user is not logged in", async () => {
    let reportStatusHandler!: Function;

    const fakeBot = {
      command: jest.fn((command, handler) => {
        if (command === "reportstatus") reportStatusHandler = handler;
      }),
      catch: jest.fn(),
    } as any;

    checkReports(fakeBot);

    const ctx = createMockCtx("/reportstatus 44", {});

    await reportStatusHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(
      "❌ You need to login first. Use /login to authenticate."
    );
  });
});
