const { body } = require("express-validator");

exports.rules = (method) => {
  switch (method) {
    case "login":
      return [
        body("email")
          .notEmpty()
          .withMessage("email is required!")
          .isEmail()
          .withMessage("Invalid email format")
          .isLength({ max: 64 })
          .escape()
          .trim(),
        body("password")
          .notEmpty()
          .withMessage("password is required")
          .isLength({ max: 64 })
          .escape()
          .trim(),
      ];

    case "refreshToken":
      return [
        body("refresh_token")
          .notEmpty()
          .withMessage("refresh_token is required!"),
      ];

    default:
      return [];
      break;
  }
};
