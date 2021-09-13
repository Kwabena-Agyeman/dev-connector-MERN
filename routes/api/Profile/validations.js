const { body } = require("express-validator");

const validations = {
  ProfileValidations: [
    body("status").notEmpty().withMessage("Status is required"),
    body("skills").notEmpty().withMessage("skills are required"),
  ],
};

module.exports = validations;
