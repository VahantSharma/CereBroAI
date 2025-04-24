const express = require("express");
const router = express.Router();
const facilitiesController = require("../controllers/facilities.controller");

// Get all facilities
router.get("/", facilitiesController.getAllFacilities);

// Get facilities near a location
router.get("/nearby", facilitiesController.getNearbyFacilities);

module.exports = router;
