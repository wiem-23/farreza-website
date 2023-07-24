const { model, Schema } = require("mongoose");
const { RecalamtionCollectionName, RecalamtionModelName } = require("../constants/recalamtion.constant");
const { UserModelName } = require("../constants/user.constant");

const RecalamtionSchema = Schema({
    'title': { 'type': String, 'required': true },
    'img': { 'type': String },
    'description': { 'type': String, 'required': false, 'maxLength': 300 },
    'owner': { 'type': Schema.Types.ObjectId, 'ref': UserModelName, required: true },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Recalamtion = model(RecalamtionModelName, RecalamtionSchema, RecalamtionCollectionName);

module.exports = Recalamtion;
