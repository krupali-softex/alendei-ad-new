const nodemailer = require("nodemailer");

(async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS (STARTTLS)
    auth: {
      user: "a30688468@gmail.com",         // ✅ your Gmail address
      pass: "gwit bwcc ziac jyyo", // ✅ 16-digit App Password
    },
    logger: true, // Log to console
    debug: true,  // Detailed SMTP debug logs
  });

  try {
    const info = await transporter.sendMail({
      from: '"Your Name" a30688468@gmail.com', // Must match your Gmail address
      to: "akhil.priya@alendei.com", // Can be your own address for testing
      subject: "SMTP Test Email",
      text: "This is a test email sent using Gmail SMTP and Nodemailer.",
      html: "<p>This is a <strong>test</strong> email sent using <em>Gmail SMTP</em> and Nodemailer.</p>",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
})();
