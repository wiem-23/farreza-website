const express = require("express");
const router = express.Router();
const { signup, login, getUserRole } = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/signup", signup);
router.post("/login", login);
router.get("/role", isAuthenticated, getUserRole);

module.exports = router;
