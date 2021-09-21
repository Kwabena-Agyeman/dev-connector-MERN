/** @format */

const { body } = require("express-validator");

const validations = {
  ProfileValidations: [
    body("status").notEmpty().withMessage("Status is required"),
    body("skills").notEmpty().withMessage("skills are required"),
  ],
  ExperienceValidations: [
    body("title").notEmpty().withMessage("Title is required"),
    body("company").notEmpty().withMessage("company is required"),
    body("from").notEmpty().withMessage("From date is required"),
  ],
};

module.exports = validations;
