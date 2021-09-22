/** @format */

const express = require("express");
const authMiddleware = require("../../../middlewares/auth");
const validationMiddleware = require("../../../middlewares/validator");
const validations = require("./validations");

const UserModel = require("../../../models/User");
const PostModel = require("../../../models/Post");
const ProfileModel = require("../../../models/Profile");

const router = express.Router();

// ***************************************************************************
// @route            POST api/posts
// @description      CREATE A NEW POST
// @access           PRIVATE ROUTE
router.post(
  "/",
  authMiddleware,
  validations.PostValidations,
  validationMiddleware,
  async (req, res) => {
    try {
      // getting the name, avatar and user info for the user who s=is creating the post
      // remeber, out post model requires a user
      const userID = req.user.currentUser.id;
      const user = await UserModel.findById(userID).select("-password");

      const newPost = new PostModel({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: userID,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ***************************************************************************
// @route            GET api/posts
// @description      GET ALL POSTS
// @access           PRIVATE ROUTE

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ***************************************************************************
// @route            GET api/posts/:id
// @description      GET SINGLE POST BY ID
// @access           PRIVATE ROUTE

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Posts not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Posts not found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
