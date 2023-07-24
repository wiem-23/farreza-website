const Model = require("../models/Order");
const Offer = require("../models/Offer");
const ParameterModel = require("../models/Parameter");
const Subscription = require("../models/Subscription");
const { getAllModels, getOneModel, createModel, updateModel, deleteModel } = require('../repositories/factory.repository');
const { ADMIN, VENDOR } = require("../constants/roles.constant");
const { Types } = require("mongoose");
const { ORDER_STATUS_CONST } = require("../constants/order.constant");
const { OfferCollectionName } = require("../constants/offer.constant");
const { SubscriptionCollectionName } = require("../constants/subscription.constant");
const { ShippingParam, PercentageParam } = require("../constants/parameter.constant");

const getDocsForAdmin = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        if (req?.query?.order_status) {
            filter.order_status = req?.query?.order_status
        }
        if (req?.query?.type) {
            filter.type = req?.query?.type
        }
        if (req?.user?.role != ADMIN) {
            filter.buyer = new Types.ObjectId(req.user._id)
        }
        if (req.query.title) {
            filter.title = new RegExp(req.query.title, "i");
        }
        if (req.query.enabled) {
            filter.enabled = req.query.enabled;
        } else {
            filter.enabled = true
        }
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.title = 1;
            } else if (req.query.sort === "desc") {
                sort.title = -1;
            }
        }
        const docs = await Model.find(filter)
            .sort(sort)
            .limit(numberOfResults)
            .skip(pages)
        const counter = await Model.countDocuments(filter);
        res.status(200).json({ docs, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

const createOrder = async (req, res) => {
    try {
        const {
            productId,
            type,
            buyerName,
            buyerPhone,
            zipCode,
            city,
            adress
        } = req.body;
        const userId = req.user._id
        console.log("createOrder userId :", userId);
        if (!productId || !buyerName || !type || !buyerPhone || !zipCode || !city || !adress) {
            res.status(400).json({
                message: "Merci de remplir tous les champs.",
            });
        } else {
            console.log("type :", type);
            var doc
            if (type == OfferCollectionName) {
                doc = await Offer.findById(productId)
            } else if (type == SubscriptionCollectionName) {
                doc = await Subscription.findById(productId)
            } else res.status(400).json({ message: "Type invalide." });

            if (!doc) res.status(400).json({ message: "Document Non trouvé." });
            console.log("doc :", doc);

            const price = doc?.product_price || doc?.price;
            console.log("price: ", price);
            if (type == OfferCollectionName) {
                if (price < 30) {
                    res.status(400).json({
                        message: "Prix Minimum  : 30DT",
                    });
                }
                else if (!doc?.owner) {
                    res.status(400).json({
                        message: "Owner est obligatoire  : 30DT",
                    });
                }
            }
            var shipping = 0
            var percentage = 0;
            const shippingDoc = await ParameterModel.findOne({ "key": ShippingParam }, { value: 1 })
            console.log("shippingDoc :", shippingDoc);
            if (shippingDoc) {
                shipping = shippingDoc.value;
            }
            const PercentageDoc = await ParameterModel.findOne({ "key": PercentageParam }, { value: 1 })
            console.log("PercentageDoc : ", PercentageDoc);
            if (PercentageDoc) {
                percentage = PercentageDoc.value;
            }
            console.log("shipping ", shipping);
            console.log("percentage ", percentage);

            const amount = type == OfferCollectionName ? shipping + price : price 
            console.log("amount ");
            const orderBody = {
                buyer: userId,
                buyerName,
                type,
                buyerPhone,
                productId,
                product_name: doc?.product_name || doc.title,
                img: doc.img,
                product_price: price,
                shipping,
                percentage,
                amount,
                zipCode,
                city,
                adress,
            }
            console.log("if (doc?.owner)");
            if (doc?.owner) orderBody["owner"] = doc?.owner
            console.log("after if (doc?.owner)");
            const newOrder = new Model(orderBody);
            await newOrder.save();
            res.json({ ...newOrder, status: "succeeded" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req?.user
        if (role != ADMIN) {
            return res.sendStatus(403);
        }
        const object = await Model.findById(id)
            .populate({ path: 'buyer', select: 'email account' })
            .populate({ path: 'owner', select: 'email account' });
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.RETRIEVED")
                }
            );

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateOrderById = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const entity = await Model.findById(id);
        if (!entity) return res.sendStatus(404);
        updates.forEach(update => {
            if (req?.user?.role == VENDOR) {
                if (update == "order_status" && req.body[update] == ORDER_STATUS_CONST.canceled) {
                    entity[update] = req.body[update];
                } else {
                    return res.sendStatus(403);
                }
            } else if (req?.user?.role == ADMIN) {
                entity[update] = req.body[update];
            }
        });
        await entity.save();
        return res.json(
            {
                response: entity,
                message: req.t("SUCCESS.SAVED"),
            }
        );

    } catch (e) {
        logger.error(`Error in updateModel() function : ${e}`)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
    }
}

const getOne = getOneModel(Model);
const deleteOne = deleteModel(Model);

module.exports = {
    getDocsForAdmin,
    getOne,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOne
}