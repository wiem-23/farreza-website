const express = require("express");
const router = express.Router();
const {  getOrderById, createOrder, updateOrderById, getDocsForAdmin } = require("../controllers/order.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
console.log("Orders.route.js");

router.get("/admin", isAuthenticated, getDocsForAdmin);
router.get("/:id", isAuthenticated, getOrderById);
router.post("/publish", isAuthenticated, createOrder);
router.put("/update/:id", isAuthenticated, updateOrderById);

module.exports = router;
