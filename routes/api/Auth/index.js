const express = require("express");

const router = express.Router();

const authmiddleware = require("../../../middlewares/auth");

const User = require("../../../models/User");

// @route GET api/auth
// @description Test Route
// @access Public Route
router.get("/", authmiddleware, async (req, res) => {
  try {
    // NOTE : req.user was created and returned from our auth-middleware function and it contains users id
    // we assigned out decoded token [which contains the user's id] to req.user .We did this in auth-middleware

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
