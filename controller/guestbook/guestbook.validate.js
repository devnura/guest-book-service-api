const { body } = require("express-validator");

exports.rules = (method) => {
  switch (method) {
    case "create-by-guest":
      return [
        body("name")
          .notEmpty()
          .withMessage("name is required!")
          .isLength({ max: 255 })
          .escape()
          .trim(),
        body("address")
          .notEmpty()
          .withMessage("address is required")
          .isLength({ max: 255 })
          .escape()
          .trim(),
        body("phone_number")
          .notEmpty()
          .withMessage("Phone number is required")
          .isLength({ max: 32 })
          .withMessage("Phone number must be at most 32 characters")
          .isNumeric() // Adjust the regex based on your requirements
          .escape()
          .trim(),
        body("note")
          .exists()
          .withMessage("note is required")
          .optional()
          .isLength({ max: 2000 })
          .withMessage("note must be at most 2000 characters")
          .escape()
          .trim(),
      ];

    default:
      return [];
      break;
  }
};
