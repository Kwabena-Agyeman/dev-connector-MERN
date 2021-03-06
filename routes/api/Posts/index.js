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

// ***************************************************************************
// @route            DELETE api/posts/:id
// @description      DELETE A SINGLE POST
// @access           PRIVATE ROUTE

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // check to see if user requesting the deletion is the user who created the post
    const userID = req.user.currentUser.id;
    if (post.user.toString() !== userID) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// ***************************************************************************
// @route            PUT api/posts/like/:id
// @description      LIKE A SINGLE POST
// @access           PRIVATE ROUTE

router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    // Check if the post has already been liked by the logged in user
    // Remember, req.user.currentUser.id has the ID of the logged in user. We did this in AuthMiddleware
    const userID = req.user.currentUser.id;

    // checking if the post's Likes Array contains the ID of the user trying to like the post
    const userLiked = post.likes.filter((like) => {
      return like.user.toString() === userID;
    });

    if (userLiked.length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: userID });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ***************************************************************************
// @route            PUT api/posts/unlike/:id
// @description      UNLIKE A SINGLE POST
// @access           PRIVATE ROUTE

router.put("/unlike/:id", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    // Check if the post has already been liked by the logged in user
    // Remember, req.user.currentUser.id has the ID of the logged in user. We did this in AuthMiddleware
    const userID = req.user.currentUser.id;

    // checking if the post's Likes Array contains the ID of the user trying to like the post
    const userLiked = post.likes.filter((like) => {
      return like.user.toString() === userID;
    });

    if (userLiked.length === 0) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Make new likes array
    const newLikesArray = post.likes.filter((like) => {
      return like.user.toString() !== userID;
    });

    post.likes = newLikesArray;

    post.save();

    res.json(post.likes);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ***************************************************************************
// @route            POST api/posts.comment/:id
// @description      COMMENT ON A POST
// @access           PRIVATE ROUTE
router.post(
  "/comment/:id",
  authMiddleware,
  validations.CommentValidations,
  validationMiddleware,
  async (req, res) => {
    try {
      // getting the name, avatar and user info for the user who is commenting on the post
      // remeber, out post model requires a user
      const userID = req.user.currentUser.id;
      const user = await UserModel.findById(userID).select("-password");

      const post = await PostModel.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: userID,
      };

      post.comments.unshift(newComment);

      post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ***************************************************************************
// @route            DELETE api/posts.comment/:id/:comment_id
// @description      DELETE COMMENT ON A POST
// @access           PRIVATE ROUTE

router.delete("/comment/:id/:comment_id", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    // Pull out comment from post

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exists

    if (!comment) {
      res.status(404).json({ msg: "comment does not exist" });
    }

    // Check if user requesting deletion is the one who created the comment
    const userID = req.user.currentUser.id;

    if (comment.user.toString() !== userID) {
      return res.status(401).json({ msg: "user not authorized" });
    }

    // Make new comment array that excludes the comment we want to delete
    const newCommentsArray = post.comments.filter((postComment) => {
      return postComment.id.toString() !== comment.id;
    });

    post.comments = newCommentsArray;

    post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
