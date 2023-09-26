const express = require("express");
const router = express.Router();
const verifyToken = require("../config/verifyToken");
const productController = require("../controllers/productController");
// const commentController = require("../controllers/commentController");

// GET all posts
router.get("/", productController.getAllProducts);

// GET one post
router.get("/:product_id", productController.getOneProduct);

// POST post
router.post("/create", verifyToken, productController.createProduct);

// PUT update post
router.put("/:product_id/update", verifyToken, productController.updateProduct);

// DELETE post
router.delete(
  "/:product_id/delete",
  verifyToken,
  productController.deleteProduct
);

module.exports = router;
