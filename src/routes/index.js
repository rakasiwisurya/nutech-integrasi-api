const express = require("express");
const router = express.Router();

const { login, checkAuth } = require("../controllers/auth");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/products", auth, uploadFile("image", "uploads"), addProduct);
router.get("/products", auth, getProducts);
router.get("/products/:id", auth, getProduct);
router.put(
  "/products/:id",
  auth,
  uploadFile("image", "uploads"),
  updateProduct
);
router.delete("/products/:id", auth, deleteProduct);

module.exports = router;
