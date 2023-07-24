const { model, Schema } = require("mongoose");
const { ColorModelName, ColorCollectionName } = require("../constants/color.constant");

const ColorSchema = Schema({
    'title': { 'type': String, 'required': true },
    'img': { 'type': String },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Color = model(ColorModelName, ColorSchema, ColorCollectionName);

module.exports = Color;
