const express = require("express");
const { sendContactEmail } = require("../controllers/contact.controller");

const router = express.Router();

// Route to send contact emails
router.post("/send", sendContactEmail);

module.exports = router;
