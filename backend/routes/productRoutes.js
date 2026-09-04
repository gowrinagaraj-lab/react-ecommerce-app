const express = require("express");
const {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public catalogue endpoints
router.get("/", getProducts);
router.get("/meta", getProductMeta);
router.get("/:id", getProductById);

// Admin-only management endpoints
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
