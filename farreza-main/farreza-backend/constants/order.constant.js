const ORDER_STATUS_CONST = {
    'awaiting': 'AWAITING',
    'canceled': 'CANCELED',
    'payed': 'PAYED',
    'closed': 'CLOSED',
};
const OrderStatues = [
    ORDER_STATUS_CONST.awaiting,
    ORDER_STATUS_CONST.canceled,
    ORDER_STATUS_CONST.closed,
    ORDER_STATUS_CONST.payed,
];
module.exports = {
    OrderModelName: "Order",
    OrderCollectionName: "orders",
    OrderStatues,
    ORDER_STATUS_CONST
}