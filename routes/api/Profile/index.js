const express = require("express");

const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");
const profileModel = require("../../../models/Profile");
const UserModel = require("../../../models/User");

// ************************************************************************

// @route GET api/profile/me
// @description GET CURRENT USERS PROFILE
// @access Private Route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Remember, req.user.id comes from our decoded jwt token in our auth middleware
    // we added the user id in the payload when creating the jwt
    // we are now searching the profile table with our user id becase we refereced users id in our profile model
    const profile = await profileModel
      .findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json("No profile exists for this user");
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
