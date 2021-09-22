/** @format */

const { body } = require("express-validator");

const validations = {
  PostValidations: [body("text").notEmpty().withMessage("text is required")],
  CommentValidations: [body("text").notEmpty().withMessage("text is required")],
};

module.exports = validations;
