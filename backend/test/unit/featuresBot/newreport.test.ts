import registerNewReportFeature from '../../../src/featuresBot/newreport';
import axios from 'axios';

jest.mock('axios');

describe('Bot New Report Feature', () => {
  let botMock: any;
  let ctxMock: any;
  let commandCallback: Function;
  let callbackQueryCallback: Function;
  let textCallback: Function;
  let photoCallback: Function;
  let locationCallback: Function;

  beforeEach(() => {
    botMock = {
      command: jest.fn((cmd, cb) => {
        if (cmd === 'newreport') commandCallback = cb;
      }),
      on: jest.fn((event, cb) => {
        if (event === 'callback_query') callbackQueryCallback = cb;
        if (event === 'text') textCallback = cb;
        if (event === 'photo') photoCallback = cb;
        if (event === 'location') locationCallback = cb;
      }),
      catch: jest.fn(),
    };
    ctxMock = {
      session: {
        report: { photos: [] },
      },
      reply: jest.fn(),
      answerCbQuery: jest.fn(),
      editMessageText: jest.fn(),
      message: { text: '' },
      callbackQuery: {},
    };
    jest.clearAllMocks();
  });

  it('should register listeners', () => {
    registerNewReportFeature(botMock);
    expect(botMock.command).toHaveBeenCalledWith('newreport', expect.any(Function));
    expect(botMock.on).toHaveBeenCalledWith('callback_query', expect.any(Function));
    expect(botMock.on).toHaveBeenCalledWith('text', expect.any(Function));
    expect(botMock.on).toHaveBeenCalledWith('photo', expect.any(Function));
    expect(botMock.on).toHaveBeenCalledWith('location', expect.any(Function));
  });

  it('should start new report flow', async () => {
    registerNewReportFeature(botMock);
    await commandCallback(ctxMock);
    expect(ctxMock.session.reportState).toBe('ASK_TITLE');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Starting a NEW report'));
  });

  it('should handle title input', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_TITLE';
    ctxMock.message.text = 'My Report Title';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(ctxMock.session.report.title).toBe('My Report Title');
    expect(ctxMock.session.reportState).toBe('ASK_DESCRIPTION');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Enter the report description'));
  });

  it('should handle description input', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_DESCRIPTION';
    ctxMock.message.text = 'Description';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(ctxMock.session.report.description).toBe('Description');
    expect(ctxMock.session.reportState).toBe('ASK_CATEGORY');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Choose a category'), expect.anything());
  });

  it('should handle category selection', async () => {
    registerNewReportFeature(botMock);
    ctxMock.callbackQuery.data = 'cat_water_supply';
    
    await callbackQueryCallback(ctxMock);

    expect(ctxMock.session.report.category).toBe('water_supply');
    expect(ctxMock.session.reportState).toBe('ASK_ANONYMOUS');
    expect(ctxMock.reply).toHaveBeenCalledWith('🙈 Anonymous? (yes/no)');
  });

  it('should handle anonymous input', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_ANONYMOUS';
    ctxMock.message.text = 'yes';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(ctxMock.session.report.anonymous).toBe(true);
    expect(ctxMock.session.reportState).toBe('ASK_PHOTOS');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Send photos'));
  });

  it('should handle photo input', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_PHOTOS';
    ctxMock.message.photo = [{ file_id: 'photo1' }];
    
    await photoCallback(ctxMock);

    expect(ctxMock.session.report.photos).toContain('photo1');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Photo saved'));
  });

  it('should handle done photos', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_PHOTOS';
    ctxMock.message.text = 'done';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(ctxMock.session.reportState).toBe('ASK_LOCATION');
    expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Send your location'), expect.anything());
  });

  it('should handle location and submit', async () => {
    registerNewReportFeature(botMock);
    ctxMock.session.reportState = 'ASK_LOCATION';
    ctxMock.session.token = 'token';
    ctxMock.message.location = { latitude: 10, longitude: 20 };
    
    (axios.get as jest.Mock).mockResolvedValue({ data: { display_name: 'Address' } });
    (axios.post as jest.Mock).mockResolvedValue({});

    await locationCallback(ctxMock);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/v1/reports', expect.objectContaining({
      latitude: 10,
      longitude: 20,
      address: 'Address'
    }), expect.anything());
    expect(ctxMock.reply).toHaveBeenCalledWith('✅ Report submitted!');
    expect(ctxMock.session.reportState).toBeNull();
  });
});
