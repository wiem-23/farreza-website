const express = require("express");
const { getOffersForUsers, getOffersForAdmin, getUserOffers, getOfferById, createOffer, deleteOne, updateOffer } = require("../controllers/offer.controller");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");


router.get("/", getOffersForUsers);
router.get("/admin", isAuthenticated, getOffersForAdmin);
router.get("/me", isAuthenticated, getUserOffers);
router.get("/:id", getOfferById);
router.post("/publish", isAuthenticated, createOffer);
router.put("/update/:id", isAuthenticated, updateOffer);
router.delete("/delete/:id", isAuthenticated, deleteOne);
module.exports = router;
