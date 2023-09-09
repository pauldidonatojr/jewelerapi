const nodemailer = require("nodemailer");

const sendTokenEmail = async (receiverEmail, verify_token) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // const approvalLink = `http://localhost:4242/auth/api/verify?email=${encodeURIComponent(
    //   receiverEmail
    // )}&verify_token=${encodeURIComponent(verify_token)}`;



    const sendTokenLink = `https://nocableneeded-auth.onrender.com/auth/send-token/${encodeURIComponent(
      receiverEmail
    )}/${encodeURIComponent(verify_token)}`;


    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: process.env.MAIL_USERNAME,
      subject: "Email verification for " + receiverEmail,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

          <!-- Approval Card -->
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p>Please click the button below to send Referral Code to ${receiverEmail}:</p>

            <!-- Approval Button -->
            <a href="${sendTokenLink}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Approve</a>
          </div>

          <p style="margin-top: 20px;">If the button above does not work, you can also copy and paste the following link into your browser:</p>
          <p>${sendTokenLink}</p>
        </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return reject({ message: "Error has occurred" });
      }
      return resolve({ message: "Email sent!" });
    });
  });
};

const sendEmail = async (req, res) => {
  const { email, verify_token } = req.params; // Use req.params to access route parameters
  if (!email || !verify_token) {
    console.log("Receiver email or verification token is missing.");
    return res.status(400).json({ message: "Receiver email or verification token is missing." });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const approvalLink = `https://nocableneeded-auth.onrender.com/auth/api/verify?email=${encodeURIComponent(
      email
    )}&verify_token=${encodeURIComponent(verify_token)}`;


    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Verify your NOCABLESNEEDED Account!",
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Approval Card -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">Thank you for signing up! To verify your email address, please copy the referral code below and use it to complete your signup process:</p>

        <!-- Verification Token Text Box -->
        <input
          type="text"
          id="verificationToken"
          value="${verify_token}"
          readonly
          style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;"
        >

      </div>
    </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent!" });
    });
  } catch (err) {
    console.log("Error sending email", err);
    return res.status(500).json({ message: "Error sending email" });
  }
};

const resetPasswordEmail = async (receiverEmail, verify_token) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const approvalLink = `https://nocableneeded-auth.onrender.com/auth/api/verify?email=${encodeURIComponent(
      receiverEmail // Use 'email' from route parameters
    )}&verify_token=${encodeURIComponent(verify_token)}`;

    const sendTokenLink = `https://nocableneeded-auth.onrender.com/auth/send-token/${encodeURIComponent(
      receiverEmail
    )}/${encodeURIComponent(verify_token)}`;

    const mail_config = {
      from: process.env.MAIL_USERNAME,
      to: receiverEmail,
      subject: "Password Reset verification for " + receiverEmail,
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Approval Card -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">To verify your email address, please copy the referral code below and use it to complete your reset password process:</p>

        <!-- Verification Token Text Box -->
        <input
          type="text"
          id="verificationToken"
          value="${verify_token}"
          readonly
          style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;"
        >

      </div>
    </div>
      `,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log("error", error);
        return reject({ message: "error has occured" });
      }
      return resolve({ message: "Email sent!" });
    });
  });
};


module.exports = { sendEmail, sendTokenEmail, resetPasswordEmail };
