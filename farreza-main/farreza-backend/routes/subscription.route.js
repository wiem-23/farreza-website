const express = require("express");
const router = express.Router();
const { getAll, getOne, create, update, deleteOne, getDocsForUsers, getDocsForAdmin } = require("../controllers/subscription.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
console.log("Subscription.route.js");

router.get("/users", getDocsForUsers);
router.get("/admin", isAuthenticated, getDocsForAdmin);
router.get("/:id", getOne);
router.post("/publish", isAuthenticated, create);
router.put("/update/:id", isAuthenticated, update);
router.delete("/delete/:id", isAuthenticated, deleteOne);

module.exports = router;
