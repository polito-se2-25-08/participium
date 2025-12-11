import checkReports from '../../../src/featuresBot/checkReports';
import axios from 'axios';

jest.mock('axios');

describe('Bot Check Reports Feature', () => {
  let botMock: any;
  let ctxMock: any;
  let myReportsCallback: Function;
  let reportStatusCallback: Function;

  beforeEach(() => {
    botMock = {
      command: jest.fn((cmd, cb) => {
        if (cmd === 'myreports') myReportsCallback = cb;
        if (cmd === 'reportstatus') reportStatusCallback = cb;
      }),
      catch: jest.fn(),
    };
    ctxMock = {
      session: {
        token: 'mock-token',
        id: 1,
      },
      reply: jest.fn(),
      message: { text: '' },
    };
    jest.clearAllMocks();
  });

  it('should register commands', () => {
    checkReports(botMock);
    expect(botMock.command).toHaveBeenCalledWith('myreports', expect.any(Function));
    expect(botMock.command).toHaveBeenCalledWith('reportstatus', expect.any(Function));
  });

  describe('/myreports', () => {
    it('should ask to login if not authenticated', async () => {
      checkReports(botMock);
      ctxMock.session = {};
      await myReportsCallback(ctxMock);
      expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('You need to login first'));
    });

    it('should fetch and display reports', async () => {
      checkReports(botMock);
      const mockReports = [
        { id: 1, title: 'Report 1', status: 'OPEN' },
        { id: 2, title: 'Report 2', status: 'CLOSED' },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockReports } });

      await myReportsCallback(ctxMock);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/1/reports');
      expect(ctxMock.reply).toHaveBeenCalledWith('📋 Here is the list of your reports:');
      expect(ctxMock.reply).toHaveBeenCalledWith('📄 Report #1: Report 1\n📊 Status: OPEN');
      expect(ctxMock.reply).toHaveBeenCalledWith('📄 Report #2: Report 2\n📊 Status: CLOSED');
    });

    it('should handle no reports', async () => {
      checkReports(botMock);
      (axios.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

      await myReportsCallback(ctxMock);

      expect(ctxMock.reply).toHaveBeenCalledWith("📝 You don't have any reports yet.");
    });

    it('should handle errors', async () => {
      checkReports(botMock);
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await myReportsCallback(ctxMock);

      expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining("Sorry, I couldn't fetch your reports"));
    });
  });

  describe('/reportstatus', () => {
    it('should ask to login if not authenticated', async () => {
      checkReports(botMock);
      ctxMock.session = {};
      await reportStatusCallback(ctxMock);
      expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('You need to login first'));
    });

    it('should fetch and display report status and notifications', async () => {
      checkReports(botMock);
      ctxMock.message.text = '/reportstatus 1';
      const mockReport = { id: 1, title: 'Report 1', status: 'OPEN' };
      const mockNotifications = [
        { id: 1, report_id: 1, message: 'Update 1', created_at: '2023-01-01' },
      ];

      (axios.get as jest.Mock).mockImplementation((url) => {
        if (url.includes('/reports/1')) return Promise.resolve({ data: { data: mockReport } });
        if (url.includes('/notifications')) return Promise.resolve({ data: { data: mockNotifications } });
        return Promise.reject(new Error('Not found'));
      });

      await reportStatusCallback(ctxMock);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/reports/1');
      expect(ctxMock.reply).toHaveBeenCalledWith('📄 Report #1: Report 1\n📊 Status: OPEN');
      expect(ctxMock.reply).toHaveBeenCalledWith('📢 Recent updates for this report:');
      expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Update 1'));
    });

    it('should handle invalid report ID', async () => {
      checkReports(botMock);
      ctxMock.message.text = '/reportstatus abc';
      await reportStatusCallback(ctxMock);
      expect(ctxMock.reply).toHaveBeenCalledWith(expect.stringContaining('Please provide a valid report ID'));
    });
  });
});
