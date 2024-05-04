import { createTransport } from 'nodemailer';

let transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.hrcentral@gmail.com',
    pass: 'H4C3ntr@l'
  }
});

async function sendEmail(to, subject, text) {
  let mailOptions = {
    from: 'noreply.hrcentral@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error sending email: ' + error);
  }
}

export default sendEmail;