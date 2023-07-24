const PROD_STATUS_CONST = {
    'awaiting': 'AWAITING',
    'accepted': 'ACCEPTED',
    'rejected': 'REJECTED',
    'delivery': 'DELIVERY',
    'delivered': 'DELIVERED'
};
const ProductStatues = [
    PROD_STATUS_CONST.awaiting,
    PROD_STATUS_CONST.accepted,
    PROD_STATUS_CONST.rejected,
    PROD_STATUS_CONST.delivery,
    PROD_STATUS_CONST.delivered
];
module.exports = {
    OfferModelName: "Offer",
    OfferCollectionName: "offers",
    OfferGridFsBucketName: "offer_uploads",
    ProductStatues,
    PROD_STATUS_CONST
}