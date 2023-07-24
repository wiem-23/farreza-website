const { model, Schema } = require("mongoose");
const { SubscriptionCollectionName, SubscriptionModelName } = require("../constants/subscription.constant");

const SubscriptionSchema = Schema({
    'title': { 'type': String, 'required': true },
    'price': { 'type': Number, 'required': true },
    'description': { 'type': String, 'required': false, 'maxLength': 300 },
    'img': { 'type': String },
    'enabled': { 'type': Boolean, 'default': true }
}, { timestamps: true });

const Subscription = model(SubscriptionModelName, SubscriptionSchema, SubscriptionCollectionName);

module.exports = Subscription;
