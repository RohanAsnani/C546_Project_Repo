import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';
dotenv.config();
//GJA4RJ8NEXDK417YRC6YTESY for sendgrid
// let transporter = createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'noreply.hrcentral@gmail.com',
//     pass: process.env.GMAIL_PASSWORD
//   }
// });

let options = {
  auth: {
    api_key: process.env.SENGRID_API_KEY // replace with your SendGrid API key
  }
}

let mailer = nodemailer.createTransport(sgTransport(options));


async function sendEmail(to, subject, text) {
  let mailOptions = {
    from: 'noreply.hrcentral@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  try {
    let info = await mailer.sendMail(mailOptions);
    console.log('Email sent: ');
    console.log(info);
    return info;
  } catch (error) {
    console.log('Error sending email: ' + error);
  }
}

export default sendEmail;