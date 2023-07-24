const { model, Schema } = require("mongoose");
const { BrandCollectionName, BrandModelName } = require("../constants/brand.constant");

const BrandSchema = Schema({
    'title': { 'type': String, 'required': true },
    'img': { 'type': String },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Brand = model(BrandModelName, BrandSchema, BrandCollectionName);

module.exports = Brand;
