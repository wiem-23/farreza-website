const express = require("express");
const router = express.Router();
const { create, deleteOne, getDocsForAdmin } = require("../controllers/wish.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
console.log("Wish.route.js");

router.get("/admin", isAuthenticated, getDocsForAdmin);
router.post("/publish", isAuthenticated, create);
router.delete("/delete/:id", isAuthenticated, deleteOne);

module.exports = router;
