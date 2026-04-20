const nodemailer = require("nodemailer");

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send email function
const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: '"Auth App" <gamesmugler95@gmail.com>', // 🔥 better sender name
      to: email,
      subject: "OTP Verification",

      // 🔥 HTML email (better UI)
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color: blue;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
