const { model, Schema } = require("mongoose");
const { CategoryCollectionName, CategoryModelName } = require("../constants/category.constant");

const CategorySchema = Schema({
    'title': { 'type': String, 'required': true },
    'img': { 'type': String },
    'parentId': { 'type': Schema.Types.ObjectId, 'ref': CategoryModelName },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Category = model(CategoryModelName, CategorySchema, CategoryCollectionName);

module.exports = Category;