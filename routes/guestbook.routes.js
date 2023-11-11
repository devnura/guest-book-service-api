const express = require("express");
const router = express.Router();
const controller = require("../controller/guestbook/guestbook.controller");
const auth = require("../middleware/jwt.middleware");
const validator = require("../controller/guestbook/guestbook.validate");
const helper = require("../helper/validate.request")
// ============================== AUTH ==============================
router.post(
    "/",
    validator.rules('create-by-guest'),
    helper.validate,
    controller.createByGuest
);

router.get(
    "/",
    helper.validate,
    controller.getListByGuest
);

router.get(
  "/admin",
  auth.authenticateToken,
  helper.validate,
  controller.list
);

router.put(
  "/admin/:id",
  auth.authenticateToken,
  validator.rules('create-by-guest'),
  helper.validate,
  controller.edit
);

router.delete(
  "/admin/:id",
  auth.authenticateToken,
  helper.validate,
  controller.deleteData
);

module.exports = router;