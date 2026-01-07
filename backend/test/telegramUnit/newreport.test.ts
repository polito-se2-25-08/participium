import registerNewReportFeature from "../../src/featuresBot/newreport";
import axios from "axios";

// Mock axios
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("new report feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createCtx(overrides: any = {}) {
    return {
      session: {
        token: "fake-token",
        report: { photos: [] },
      },
      reply: jest.fn(),
      editMessageText: jest.fn(),
      answerCbQuery: jest.fn(),
      message: {},
      ...overrides,
    } as any;
  }

  it("completes a full new report flow successfully", async () => {
    let newReportHandler!: Function;
    let textHandler!: Function;
    let callbackHandler!: Function;
    let photoHandler!: Function;
    let locationHandler!: Function;

    const fakeBot = {
      command: jest.fn((cmd, h) => cmd === "newreport" && (newReportHandler = h)),
      on: jest.fn((evt, h) => {
        if (evt === "text") textHandler = h;
        if (evt === "callback_query") callbackHandler = h;
        if (evt === "photo") photoHandler = h;
        if (evt === "location") locationHandler = h;
      }),
      catch: jest.fn(),
    } as any;

    registerNewReportFeature(fakeBot);

    // STEP 1: /newreport
    const ctxStart = createCtx();
    await newReportHandler(ctxStart);

    expect(ctxStart.session.reportState).toBe("ASK_TITLE");
    expect(ctxStart.reply).toHaveBeenCalledWith(
      "📝 Starting a NEW report.\nEnter the report title:"
    );

    // STEP 2: title
    const ctxTitle = createCtx({
      message: { text: "Broken streetlight" },
      session: ctxStart.session,
    });

    await textHandler(ctxTitle, jest.fn());

    expect(ctxTitle.session.report.title).toBe("Broken streetlight");
    expect(ctxTitle.session.reportState).toBe("ASK_DESCRIPTION");

    // STEP 3: description
    const ctxDesc = createCtx({
      message: { text: "Light not working at night" },
      session: ctxTitle.session,
    });

    await textHandler(ctxDesc, jest.fn());

    expect(ctxDesc.session.report.description).toBe("Light not working at night");
    expect(ctxDesc.session.reportState).toBe("ASK_CATEGORY");

    // STEP 4: category callback
    const ctxCategory = createCtx({
      callbackQuery: { data: "cat_public_lighting" },
      session: ctxDesc.session,
    });

    await callbackHandler(ctxCategory);

    expect(ctxCategory.session.report.category).toBe("public_lighting");
    expect(ctxCategory.session.reportState).toBe("ASK_ANONYMOUS");

    // STEP 5: anonymous yes
    const ctxAnon = createCtx({
      message: { text: "yes" },
      session: ctxCategory.session,
    });

    await textHandler(ctxAnon, jest.fn());

    expect(ctxAnon.session.report.anonymous).toBe(true);
    expect(ctxAnon.session.reportState).toBe("ASK_PHOTOS");

    // STEP 6: photo upload
    const ctxPhoto = createCtx({
      message: {
        photo: [{ file_id: "photo_1" }],
      },
      session: ctxAnon.session,
    });

    await photoHandler(ctxPhoto);

    expect(ctxPhoto.session.report.photos.length).toBe(1);

    // STEP 7: done photos
    const ctxDone = createCtx({
      message: { text: "done" },
      session: ctxPhoto.session,
    });

    await textHandler(ctxDone, jest.fn());

    expect(ctxDone.session.reportState).toBe("ASK_LOCATION");

    // STEP 8: location
    mockedAxios.get.mockResolvedValueOnce({
      data: { display_name: "Test Address" },
    } as any);

    mockedAxios.post.mockResolvedValueOnce({} as any);

    const ctxLocation = createCtx({
      message: {
        location: { latitude: 45.0, longitude: 9.0 },
      },
      session: ctxDone.session,
    });

    await locationHandler(ctxLocation);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(ctxLocation.reply).toHaveBeenCalledWith("✅ Report submitted!");
    expect(ctxLocation.session.reportState).toBeNull();
  });

  it("fails when report submission fails", async () => {
    let locationHandler!: Function;

    const fakeBot = {
      command: jest.fn(),
      on: jest.fn((evt, h) => evt === "location" && (locationHandler = h)),
      catch: jest.fn(),
    } as any;

    registerNewReportFeature(fakeBot);

    mockedAxios.get.mockResolvedValueOnce({
      data: { display_name: "Test Address" },
    } as any);

    mockedAxios.post.mockRejectedValueOnce(new Error("Server error"));

    const ctx = createCtx({
      message: {
        location: { latitude: 45, longitude: 9 },
      },
      session: {
        token: "fake-token",
        reportState: "ASK_LOCATION",
        report: {},
      },
    });

    await locationHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith("❌ Failed to submit report.");
  });
});
