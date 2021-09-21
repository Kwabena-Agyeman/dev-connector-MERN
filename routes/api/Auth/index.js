/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/User");
const validations = require("./validations");
const validationMiddleware = require("../../../middlewares/validator");
const authmiddleware = require("../../../middlewares/auth");

// @route GET api/auth
// @description Test Route
// @access Public Route
router.get("/", authmiddleware, async (req, res) => {
  try {
    // NOTE : req.user was created and returned from our auth-middleware function and it contains users id
    // we assigned our decoded token [which contains the user's id] to req.user .We did this in auth-middleware
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//

// @route POST     api/auth
// @description    AUTHENTICATE USER / LOGIN USER & GET TOKEN
// @access         Public Route
router.post(
  "/",
  validations.UserValidations,
  validationMiddleware,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Checking if user trying to login already exists in our Mongo Databse

      let user = await UserModel.findOne({ email: email });

      // if no user with that email is found in our DB
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "You have entered an invalid email or password" }],
        });
      }

      // Checking if password sent from the frontend matches the password stored in our database
      // We use a bcrypt method to compare the plain text password and the hashed password stored in our DB

      const isMatch = await bcrypt.compare(password, user.password);

      // if passwords dont match, throw an error
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "You have entered an invalid email or password" }],
        });
      }

      // Creating a payload with our found users ID
      // this payload object will be used to create a JWT for our logged in user
      const payload = {
        currentUser: {
          id: user.id,
        },
      };

      // creating the JWT with the payload
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        // { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
