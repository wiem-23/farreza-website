const express = require("express");
const router = express.Router();
const { getAll, getOne, create, update, deleteOne, getDocsForUsers, getDocsForAdmin, getParentDocsForAdmin } = require("../controllers/category.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
console.log("category.route.js");

router.get("/users", getDocsForUsers);
router.get("/admin", getDocsForAdmin);
router.get("/admin/parent", getParentDocsForAdmin);
router.get("/:id", isAuthenticated, getOne);
router.post("/publish", isAuthenticated, create);
router.put("/update/:id", isAuthenticated, update);
router.delete("/delete/:id", isAuthenticated, deleteOne);

module.exports = router;
