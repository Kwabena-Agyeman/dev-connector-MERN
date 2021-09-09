const express = require("express");

const router = express.Router();

// @route GET api/posts
// @description Test Route
// @access Public Route
router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
