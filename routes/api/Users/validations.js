const { body } = require("express-validator");

const validations = {
  UserValidations: [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isString()
      .withMessage("name should be a string"),
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
