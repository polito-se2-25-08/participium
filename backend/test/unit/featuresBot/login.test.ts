import registerLoginFeature from '../../../src/featuresBot/login';
import axios from 'axios';

jest.mock('axios');

describe('Bot Login Feature', () => {
  let botMock: any;
  let ctxMock: any;
  let commandCallback: Function;
  let textCallback: Function;

  beforeEach(() => {
    botMock = {
      command: jest.fn((cmd, cb) => {
        if (cmd === 'login') commandCallback = cb;
      }),
      on: jest.fn((event, cb) => {
        if (event === 'text') textCallback = cb;
      }),
    };
    ctxMock = {
      session: {},
      reply: jest.fn(),
      message: { text: '' },
    };
    jest.clearAllMocks();
  });

  it('should register login command and text listener', () => {
    registerLoginFeature(botMock);
    expect(botMock.command).toHaveBeenCalledWith('login', expect.any(Function));
    expect(botMock.on).toHaveBeenCalledWith('text', expect.any(Function));
  });

  it('should start login flow on /login', () => {
    registerLoginFeature(botMock);
    commandCallback(ctxMock);

    expect(ctxMock.session.loginState).toBe('ASK_USERNAME');
    expect(ctxMock.session.username).toBeNull();
    expect(ctxMock.reply).toHaveBeenCalledWith('Enter your username:');
  });

  it('should handle username input', async () => {
    registerLoginFeature(botMock);
    ctxMock.session.loginState = 'ASK_USERNAME';
    ctxMock.message.text = 'testuser';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(ctxMock.session.username).toBe('testuser');
    expect(ctxMock.session.loginState).toBe('ASK_PASSWORD');
    expect(ctxMock.reply).toHaveBeenCalledWith('Enter your password:');
  });

  it('should handle password input and login successfully', async () => {
    registerLoginFeature(botMock);
    ctxMock.session.loginState = 'ASK_PASSWORD';
    ctxMock.session.username = 'testuser';
    ctxMock.message.text = 'password';
    const next = jest.fn();

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        data: {
          token: 'mock-token',
          user: { id: 1 },
        },
      },
    });

    await textCallback(ctxMock, next);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/v1/login', {
      username: 'testuser',
      password: 'password',
    });
    expect(ctxMock.session.token).toBe('mock-token');
    expect(ctxMock.session.id).toBe(1);
    expect(ctxMock.session.loginState).toBeNull();
    expect(ctxMock.reply).toHaveBeenCalledWith('✅ Login successful!');
  });

  it('should handle login failure', async () => {
    registerLoginFeature(botMock);
    ctxMock.session.loginState = 'ASK_PASSWORD';
    ctxMock.session.username = 'testuser';
    ctxMock.message.text = 'wrongpassword';
    const next = jest.fn();

    (axios.post as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    await textCallback(ctxMock, next);

    expect(ctxMock.reply).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should ignore commands in text listener', async () => {
    registerLoginFeature(botMock);
    ctxMock.message.text = '/start';
    const next = jest.fn();

    await textCallback(ctxMock, next);

    expect(next).toHaveBeenCalled();
  });
});
