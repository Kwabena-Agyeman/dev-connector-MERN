const express = require("express");

const router = express.Router();

const validations = require("./validations");

const validationMiddleware = require("../../../middlewares/validator");

// @route POST     api/users
// @description    REGISTER USERS
// @access         Public Route
router.post(
  "/",
  validations.UserValidations,
  validationMiddleware,
  (req, res) => {
    console.log(req.body);
    res.send("User Route");
  }
);

module.exports = router;
