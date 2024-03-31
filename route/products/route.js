const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const validate = require("./../../middleware/validation");
const asyncMiddleware = require("../../middleware/asyncMiddleware");
// let imgPath = path.resolve(__dirname + "../../../");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-img-" + file.originalname);
  },
});

const upload = multer({ storage });

const product = require("./product");
router.post(
  "/",
  upload.single("productImage"),
  validate(product.productSchema),
  asyncMiddleware(product.product)
);

router.get("/", asyncMiddleware(product.getProducts));

router.get("/:productId", asyncMiddleware(product.getSingleProduct));

const categories = require("./categories");
router.get("/categories", asyncMiddleware(categories.getCategories));

router.post(
  "/add-category",
  validate(categories.categorychema),
  asyncMiddleware(categories.addCategory)
);

router.get(
  "/categories/:category",
  asyncMiddleware(categories.productsByCategories)
);

router.put(
  "/:productId",
  validate(product.productSchema),
  upload.single("productImage"),
  asyncMiddleware(product.updateProduct)
);

router.delete("/:productId", asyncMiddleware(product.deleteProduct));

module.exports = router;
