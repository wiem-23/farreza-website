const { model, Schema } = require("mongoose");
const { WishCollectionName, WishModelName } = require("../constants/wish.constant");
const { UserModelName } = require("../constants/user.constant");
const { OfferModelName } = require("../constants/offer.constant");

const WishSchema = Schema({
    'owner': { 'type': Schema.Types.ObjectId, 'ref': UserModelName, 'required': true },
    'offer': { 'type': Schema.Types.ObjectId, 'ref': OfferModelName, 'required': true },
}, { timestamps: true });

const Wish = model(WishModelName, WishSchema, WishCollectionName);

module.exports = Wish;
