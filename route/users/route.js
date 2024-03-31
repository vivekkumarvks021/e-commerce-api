const express = require("express");
const router = express.Router();
const validate = require("../../middleware/validation");
const onlyAdmin = require("../../middleware/onlyAdmin");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const users = require("./users");

router.get("/", asyncMiddleware(users.users));

router.post(
  "/",
  onlyAdmin,
  validate(users.userSchema),
  asyncMiddleware(users.addUserByAdmin)
);

router.get("/:userId", asyncMiddleware(users.singleUser));

router.put("/:userId", asyncMiddleware(users.updateUser));

router.delete("/:userId", onlyAdmin, asyncMiddleware(users.deleteUser));

module.exports = router;
