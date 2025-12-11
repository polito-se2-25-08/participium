import { sendEmail } from '../../../src/controllers/mailController';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('mailController', () => {
  let sendMailMock: jest.Mock;
  let createTransportMock: jest.Mock;

  beforeEach(() => {
    sendMailMock = jest.fn((mailOptions, callback) => {
      callback(null, { response: 'OK' });
    });
    createTransportMock = jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    });
    (nodemailer.createTransport as jest.Mock) = createTransportMock;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email successfully', async () => {
    await sendEmail('test@example.com', 'Subject', 'Body');

    expect(createTransportMock).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Subject',
        text: 'Body',
      }),
      expect.any(Function)
    );
  });

  it('should handle array of recipients', async () => {
    await sendEmail(['test1@example.com', 'test2@example.com'], 'Subject', 'Body');

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test1@example.com, test2@example.com',
      }),
      expect.any(Function)
    );
  });

  it('should log error if sending fails', async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error('Failed'), null);
    });

    await sendEmail('test@example.com', 'Subject', 'Body');

    expect(console.log).toHaveBeenCalledWith('Error occured:', expect.any(Error));
  });
});
