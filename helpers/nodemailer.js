"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMailWithNodeMailer(emailDestination) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service : 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'dolansuper3@gmail.com', // generated ethereal user
      pass: 'phpmbdvuqyoomdcn', // Ini app password untuk nodemailer
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Dolan Super 👻" <dolansuper3@mail.com>', // sender address
    to: emailDestination, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Thank you for signing up on Wander Fall!!!", // plain text body
    html: `<p>Thank you for signing up on Wander Fall!!! Let's start right away by checking out <a href="http://localhost:5173/destinations"> destinations!</a></p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {sendMailWithNodeMailer};
