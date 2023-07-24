const { model, Schema } = require("mongoose");
const { BrandModelName } = require("../constants/brand.constant");
const { CategoryModelName } = require("../constants/category.constant");
const { ColorModelName } = require("../constants/color.constant");
const { OfferModelName, ProductStatues, PROD_STATUS_CONST, OfferCollectionName } = require("../constants/offer.constant");
const { UserModelName } = require("../constants/user.constant");
const Offer = model(OfferModelName, {
  'product_name': { 'type': String },
  'product_description': { 'type': String },
  'img': { 'type': String },
  'product_price': { 'type': Number },
  'product_details': { 'type': Array },
  'product_pictures': { 'type': Array },
  'product_date': { 'type': Date, 'default': Date.now },
  'owner': {
    'type': Schema.Types.ObjectId,
    'ref': UserModelName,
  },
  'color': {
    'type': Schema.Types.ObjectId,
    'ref': ColorModelName,
  },
  'brand': {
    'type': Schema.Types.ObjectId,
    'ref': BrandModelName,
  },
  'category': {
    'type': Schema.Types.ObjectId,
    'ref': CategoryModelName,
    'required': true
  },
  'product_status': {
    'type': String,
    'enum': ProductStatues,
    'default': PROD_STATUS_CONST.awaiting
  },
  'enabled': { 'type': Boolean, 'default': true }
}, OfferCollectionName);

module.exports = Offer;
