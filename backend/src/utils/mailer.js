const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // use true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true, 
  logger: true
});

const sendMail = async ({ to, subject, html }) => {
 // console.log("Starting sendMail function"); 
  //console.time("sendMail");      

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(" Email timeout after 10s")), 10000)
  );

  try {
    const info = await Promise.race([
      transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
      }),
      timeoutPromise
    ]);

    //console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email send failed or timed out:", err);
    throw err;
  }// finally {
  //   console.timeEnd("sendMail");
  // }
};



module.exports = { sendMail };

