const express = require("express");
const router = express.Router();

const { login, checkAuth } = require("../controllers/auth");

const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

module.exports = router;
