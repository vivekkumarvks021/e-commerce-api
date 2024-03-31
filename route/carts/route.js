const express = require("express");
const router = express.Router();
const validate = require("../../middleware/validation");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
const cart = require("./cart");

router.post("/", validate(cart.cartSchema), asyncMiddleware(cart.addCart));

router.get("/", asyncMiddleware(cart.getAllCart));

router.get("/users/:userId", asyncMiddleware(cart.getUserCart));

router.get("/:cartId", asyncMiddleware(cart.getSingleCart));

router.put(
  "/:cartId",
  validate(cart.cartSchema),
  asyncMiddleware(cart.updateCart)
);

router.delete("/:cartId", asyncMiddleware(cart.deleteCart));

module.exports = router;
