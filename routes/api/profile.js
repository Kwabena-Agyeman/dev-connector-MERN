const express = require("express");

const router = express.Router();

// @route GET api/profile
// @description Test Route
// @access Public Route
router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;