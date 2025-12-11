export async function sendEmail(to: string | string[], subject: string, text: string) {
  const nodemailer = require("nodemailer");
  const recipients = Array.isArray(to) ? to : [to];
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(", "),
      subject,
      text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
	if (error) {
		return console.log('Error occured:', error);
	}
	console.log("Email sent succesfully:",  info.response);
    });
}