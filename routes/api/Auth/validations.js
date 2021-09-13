const { body } = require("express-validator");

const validations = {
  UserValidations: [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("provide a valid email"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("please enter a password with 6 or more characters"),
  ],
};

module.exports = validations;
