const express = require("express");
const router = express.Router();
const controller = require("../controller/auth/auth.controller");
const auth = require("../middleware/jwt.middleware");
const validator = require("../controller/auth/auth.validate");
const helper = require("../helper/validate.request")
// ============================== AUTH ==============================
router.post(
    "/login",
    validator.rules('login'),
    helper.validate,
    controller.loginUser
);

router.get(
  "/refresh-token",
  helper.validate,
  auth.authenticateRefreshToken,
  controller.refreshToken
);

router.post(
  "/logout",
  auth.authenticateToken,
  controller.logoutUser
);

module.exports = router;