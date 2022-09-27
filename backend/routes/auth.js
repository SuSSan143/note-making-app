const express = require("express");
const { signIn, signUp, authChecker, logout } = require("../controllers/auth");
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/check-user", authChecker);
router.delete("/logout", logout);

exports.authRoutes = router;
