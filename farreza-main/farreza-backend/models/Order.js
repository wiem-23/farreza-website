const { model, Schema } = require("mongoose");
const { OrderCollectionName, OrderModelName, OrderStatues, ORDER_STATUS_CONST } = require("../constants/order.constant");
const { UserModelName } = require("../constants/user.constant");
const { OfferModelName } = require("../constants/offer.constant");

const OrderSchema = Schema({
    'buyer': { 'type': Schema.Types.ObjectId, 'ref': UserModelName, 'required': true, },
    'owner': { 'type': Schema.Types.ObjectId, 'ref': UserModelName, 'required': false },
    'productId': { 'type': Schema.Types.ObjectId, 'ref': OfferModelName, 'required': true, },
    'buyerName': { 'type': String, 'required': true },
    'type': { 'type': String, 'required': true },
    'buyerPhone': { 'type': String, 'required': true },
    'product_name': { 'type': String, 'required': true },
    'product_price': { 'type': Number, 'ref': OfferModelName, 'required': true, },
    'img': { 'type': String },
    'shipping': { 'type': Number, 'required': true },
    'percentage': { 'type': Number, 'required': true },
    'amount': { 'type': Number, 'required': true },
    'zipCode': { 'type': String, 'required': true },
    'city': { 'type': String, 'required': true },
    'adress': { 'type': String, 'required': true },
    'order_status': { 'type': String, 'default': ORDER_STATUS_CONST.awaiting, 'enum': OrderStatues },
    'enabled': { 'type': Boolean, 'default': true }
}, { 'timestamps': true });

const Order = model(OrderModelName, OrderSchema, OrderCollectionName);

module.exports = Order;
