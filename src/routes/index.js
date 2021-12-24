const express = require("express");
const router = express.Router();

const { login, checkAuth } = require("../controllers/auth");
const { addProduct, getProducts } = require("../controllers/product");

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/products", auth, uploadFile("image", "uploads"), addProduct);
router.get("/products", auth, getProducts);

module.exports = router;
