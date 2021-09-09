const express = require("express");

const router = express.Router();

// @route GET api/users
// @description Test Route
// @access Public Route
router.get("/", (req, res) => {
  res.send("User Route");
});

module.exports = router;
