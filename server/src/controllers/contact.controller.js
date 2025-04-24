const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create email transporter
let transporter = null;

// Initialize transporter based on environment
const initializeTransporter = () => {
  // For production, use actual email service credentials
  if (process.env.NODE_ENV === "production" && process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // For development, use Ethereal Email (fake SMTP service)
    nodemailer.createTestAccount().then((testAccount) => {
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Test email account created:", testAccount.user);
    });
  }
};

// Initialize email transporter when the server starts
initializeTransporter();

/**
 * @desc    Send contact email
 * @route   POST /api/contact
 * @access  Public
 */
exports.sendContactEmail = async (req, res) => {
  try {
    console.log("Contact form submission received:", req.body);
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log("Missing required fields:", {
        name,
        email,
        subject,
        message,
      });
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: name, email, subject, message",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid email address",
      });
    }

    // If transporter isn't initialized yet, try again
    if (!transporter) {
      console.log("Transporter not initialized, attempting to initialize...");
      await initializeTransporter();

      // If still null, return error
      if (!transporter) {
        console.log("Failed to initialize transporter");
        return res.status(500).json({
          status: "error",
          message:
            "Email service not configured properly. Please try again later.",
        });
      }
    }

    console.log("Preparing email with the following details:");
    console.log("- From:", process.env.EMAIL_FROM || email);
    console.log(
      "- To:",
      process.env.EMAIL_TO || "info@cerebroai.com, support@cerebroai.com"
    );
    console.log("- Subject:", `CereBro AI Contact: ${subject}`);

    // Setup email data
    const mailOptions = {
      from: `"CereBro AI Contact" <${process.env.EMAIL_FROM || email}>`,
      to: process.env.EMAIL_TO || "info@cerebroai.com, support@cerebroai.com",
      replyTo: email,
      subject: `CereBro AI Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #6366f1;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <div style="margin-top: 20px;">
    <h3>Message:</h3>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  <hr style="margin-top: 30px;">
  <p style="color: #555; font-size: 12px;">Sent from CereBro AI Contact Form</p>
</div>
      `,
    };

    console.log("Attempting to send email...");
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    // For development, log the test URL
    let emailPreviewUrl = null;
    if (process.env.NODE_ENV !== "production") {
      emailPreviewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL: %s", emailPreviewUrl);
    }

    res.status(200).json({
      status: "success",
      message: "Your message has been sent successfully!",
      data:
        process.env.NODE_ENV !== "production"
          ? { previewUrl: emailPreviewUrl }
          : null,
    });
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send your message. Please try again later.",
    });
  }
};
