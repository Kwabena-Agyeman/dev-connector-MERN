const express = require("express");

const router = express.Router();
const authMiddleware = require("../../../middlewares/auth");
const validationMiddleware = require("../../../middlewares/validator");

const profileModel = require("../../../models/Profile");
const UserModel = require("../../../models/User");

const validations = require("./validations");

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

//
// @route POST api/profile
// @description CREATE / UPDATE A USER PROFILE
// @access Private Route

router.post(
  "/",
  authMiddleware,
  validations.ProfileValidations,
  validationMiddleware,
  async (req, res) => {
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    console.log("REQ USER", req.user.currentUser);

    // Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;

    if (website) profileFields.website = website;

    if (location) profileFields.location = location;

    if (bio) profileFields.bio = bio;

    if (status) profileFields.status = status;

    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build Social Object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    console.log(profileFields.skills);

    try {
      // Checking is any profile alreadt exists with our user's id
      let profile = await profileModel.findOne({ user: req.user.id });

      // if profile exits, then we want to update that profile
      if (profile) {
        profile = await profileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // if no profile is found, we will create a profile

      profile = new profileModel(profileFields);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//
// @route         GET  api/profile
// @description   GET ALL PROFILES
// @access        Public Route

router.get("/", async (req, res) => {
  try {
    // the populate method allows us to populate our query with data from another collection
    // remeber, our user's ID will be the same as his/her profile ID becase we referenced user ID when creating the model
    profiles = await profileModel.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
