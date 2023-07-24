const { model, Schema } = require("mongoose");
const { TransactionCollectionName, TransactionModelName } = require("../constants/transaction.constant");
const { UserModelName } = require("../constants/user.constant");

const TransactionSchema = Schema({
    'title': { 'type': String, 'required': true },
    'price': { 'type': Number, 'required': true },
    'owner': { 'type': Schema.Types.ObjectId, 'ref': UserModelName, required: true },
    'img': { 'type': String },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Transaction = model(TransactionModelName, TransactionSchema, TransactionCollectionName);

module.exports = Transaction;
