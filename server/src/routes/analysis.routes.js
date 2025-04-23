const express = require("express");
const {
  uploadAndAnalyze,
  getAnalysisHistory,
  getAnalysis,
  deleteAnalysis,
} = require("../controllers/analysis.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Upload and analyze MRI image
router.post("/upload", upload.single("image"), uploadAndAnalyze);

// Get analysis history for logged in user
router.get("/history", getAnalysisHistory);

// Get specific analysis by ID
router.get("/:id", getAnalysis);

// Delete analysis by ID
router.delete("/:id", deleteAnalysis);

module.exports = router;
