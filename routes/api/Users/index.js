const express = require("express");

const router = express.Router();

// importing validations for this particular route
const validations = require("./validations");

// importing validation middleware to check out validation results
const validationMiddleware = require("../../../middlewares/validator");

// import Mongoose user model
const UserModel = require("../../../models/User");

// importing gravatar package
const gravatar = require("gravatar");

// importing bcrypt
const bcrypt = require("bcryptjs");

//

// @route POST     api/users
// @description    REGISTER USERS
// @access         Public Route
router.post(
  "/",
  validations.UserValidations,
  validationMiddleware,
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Checking if useremail already exists in our Mongo Databse

      let user = await UserModel.findOne({ email: email });

      // if user already exists, send a 400 status as it is a bad request
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users avatar using the gravatar package and their email address
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // reassign our User variable to a new Mongoose User Model to create a new user
      user = new UserModel({
        name: name,
        email: email,
        avatar: avatar,
        password: password,
      });

      // Hash/Encrypt password with bcrypt before saving the User to our database.... check bcryptjs Docs for more info

      const salt = await bcrypt.genSalt(10);

      // creating the hashed password with bcrypt
      user.password = await bcrypt.hash(password, salt);

      // Save the user to our database
      await user.save();

      // Return Jsonwebtoken
      res.send("User Registered");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
