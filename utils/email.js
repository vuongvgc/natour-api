const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // 1 Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2 Define option
  const emailOption = {
    from: 'Vuong Do <natour@vuong.com>', // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.text, // plain text body
    // html: '<b>Hello world?</b>', // html body
  };
  // 3 Actual send an email
  try {
    await transporter.sendMail(emailOption);
  } catch (error) {
    console.log('email', error);
  }
};
module.exports = sendEmail;
