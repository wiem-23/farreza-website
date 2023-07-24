const { Types } = require("mongoose");
const { PROD_STATUS_CONST } = require("../constants/offer.constant");
const { ADMIN } = require("../constants/roles.constant");
const Offer = require("../models/Offer");
const Category = require("../models/Category");
const { deleteModel } = require('../repositories/factory.repository')


const getOffersForUsers = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        filter.enabled = true
        filter.product_status = PROD_STATUS_CONST.accepted
        if (req.query.title) {
            filter.product_name = new RegExp(req.query.title, "i");
        }
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }

        if (req.query.priceMax && req.query.priceMin) {
            filter.product_price = {
                $lte: req.query.priceMax,
                $gte: req.query.priceMin,
            };
        } else if (req.query.priceMax) {
            filter.product_price = {
                $lte: req.query.priceMax,
            };
        } else if (req.query.priceMin) {
            filter.product_price = {
                $gte: req.query.priceMin,
            };
        }
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.product_price = 1;
            } else if (req.query.sort === "desc") {
                sort.product_price = -1;
            }
        } else {
            sort._id = -1
        }
        if (req?.query?.category) {
            //workhere
            categId = new Types.ObjectId(req?.query?.category)
            var categs = []

            // // if categ id is a categ child we need to get parent id 
            // /* Checking if the category is a parent category or a child category. */
            // const categParent = await Category.findOne({ _id: categId, parentId: { $ne: null } })
            // if (categParent) {
            //     categs.push(categParent._id)
            // }


            const categChildren = await Category.find({ parentId: categId })
            if (categChildren && categChildren.length) {
                categs = categChildren.map(x => x._id)
            }
            categs.push(categId)

            console.log("categs :", categs)
            filter.category = { $in: categs }
        }
        const offers = await Offer.find(filter, {
            '_id': 1,
            'product_price': 1,
            'img': 1,
            'product_details': 1,
            'category': 1,
            'product_name': 1,
            'product_description': 1
        }).populate({ path: "category", select: { title: 1 } })
            .sort(sort)
            .limit(numberOfResults)
            .skip(pages)
        const counter = await Offer.countDocuments(filter);
        res.status(200).json({ offers, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const getOffersForAdmin = async (req, res) => {
    try {
        console.log("req.user :", req.user);
        console.log("req.user.role :", req.user.role);
        console.log("req.user._id :", req.user._id);
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        console.log("req.query.enabled :", req.query.enabled);
        filter.enabled = req.query.enabled
        console.log("req.query.enabled :", req.query.enabled);
        if (req?.query?.product_status) {
            filter.product_status = req?.query?.product_status
        }
        if (req?.user?.role != ADMIN) {
            filter.owner = new Types.ObjectId(req.user._id)
        }
        console.log("filter.product_status :", filter.product_status);
        if (req.query.title) {
            filter.product_name = new RegExp(req.query.title, "i");
        }
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }
        if (req.query.priceMax && req.query.priceMin) {
            filter.product_price = {
                $lte: req.query.priceMax,
                $gte: req.query.priceMin,
            };
        } else if (req.query.priceMax) {
            filter.product_price = {
                $lte: req.query.priceMax,
            };
        } else if (req.query.priceMin) {
            filter.product_price = {
                $gte: req.query.priceMin,
            };
        }
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.product_price = 1;
            } else if (req.query.sort === "desc") {
                sort.product_price = -1;
            }
        }
        const offers = await Offer.find(filter)
            .sort(sort)
            .limit(numberOfResults)
            .skip(pages)
            .populate({
                path: "owner",
                select: "account",
            }).populate({ path: "category", select: { title: 1 } });
        const counter = await Offer.countDocuments(filter);
        res.status(200).json({ offers, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const getUserOffers = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        if (req.query.title) {
            filter.product_name = new RegExp(req.query.title, "i");
        }
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }
        if (req.query.priceMax && req.query.priceMin) {
            filter.product_price = {
                $lte: req.query.priceMax,
                $gte: req.query.priceMin,
            };
        } else if (req.query.priceMax) {
            filter.product_price = {
                $lte: req.query.priceMax,
            };
        } else if (req.query.priceMin) {
            filter.product_price = {
                $gte: req.query.priceMin,
            };
        }
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.product_price = 1;
            } else if (req.query.sort === "desc") {
                sort.product_price = -1;
            }
        }
        const offers = await Offer.find(filter)
            .sort(sort)
            .limit(numberOfResults)
            .skip(pages)
            .populate({
                path: "owner",
                select: "account",
            }).populate({ path: "category", select: { title: 1 } });
        const counter = await Offer.countDocuments(filter);
        res.status(200).json({ offers, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const getOfferById = async (req, res) => {
    try {
        console.log("getOfferById :");
        const offer = await Offer.findById(req.params.id).populate({
            path: "owner",
            select: "account.username account.phone account.avatar",
        }).populate({ path: "category", select: { title: 1 } });
        if (!offer) {
            res.status(400).json({
                message: "Offer does not exist",
            });
        } else {
            res.status(200).json(offer);
        }
    } catch (error) {
        res.status(400).json({
            message: "Bad request",
        });
    }
}
const createOffer = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            condition,
            city,
            brand,
            size,
            color,
            category,
        } = req.body;

        if (price > 100000) {
            res.status(400).json({
                message: "Maximum price : 100000",
            });
        } else if (price <= 30) {
            res.status(400).json({
                message: "Minimum price : 30TND",
            });
        } else if (title.length > 50) {
            res.status(400).json({
                message: "Title length must be under 50 characters.",
            });
        } else if (description.length > 500) {
            res.status(400).json({
                message: "Description length must be under 500 characters.",
            });
        } else {
            const newOffer = new Offer({
                product_name: title,
                product_description: description,
                product_price: price,
                category: category,
                product_details: [
                    { MARQUE: brand },
                    { TAILLE: size },
                    { ETAT: condition },
                    { COULEUR: color },
                    { EMPLACEMENT: city },
                ],
                owner: req.user,
            });

            await newOffer.save();
            res.json(newOffer);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateOffer = async (req, res) => {
    try {
        console.log("updateOffer.req.body ", req.body);
        const {
            title,
            description,
            price,
            condition,
            city,
            brand,
            size,
            color,
            category,
            product_status
        } = req.body;

        if (price > 100000) {
            res.status(400).json({
                message: "Maximum price : 100000",
            });
        } else if (price <= 0) {
            res.status(400).json({
                message: "Minimum price : 1TND",
            });
        } else if (title.length > 50) {
            res.status(400).json({
                message: "Title length must be under 50 characters.",
            });
        } else if (description.length > 500) {
            res.status(400).json({
                message: "Description length must be under 500 characters.",
            });
        } else {
            const offer = await Offer.findById(req.params.id);
            if (offer) {
                if (title) {
                    offer.product_name = title;
                    offer.markModified('product_name')
                }
                if (description) {
                    offer.product_description = description;
                    offer.markModified('product_description')
                }
                if (price) {
                    offer.product_price = price;
                    offer.markModified('product_price')
                }
                if (category) {
                    offer.category = category;
                    offer.markModified('category')
                }
                if (product_status && req?.user?.role == ADMIN) {
                    offer.product_status = product_status;
                    offer.markModified('product_status')
                }
                offer.product_details = [
                    { MARQUE: brand },
                    { TAILLE: size },
                    { ETAT: condition },
                    { COULEUR: color },
                    { EMPLACEMENT: city },
                ];
                offer.markModified('product_details')
                await offer.save();
                res.status(200).json({
                    message: "Offer modified",
                });
            } else {
                res.status(400).json({
                    message: "Offer does not exist",
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await offer.deleteOne();
            res.status(200).json({
                message: "Offer deleted succesfully !",
            });
        } else {
            res.status(400).json({
                message: "Offer does not exist",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Bad request",
            error: error
        });
    }
}

const deleteOne = deleteModel(Offer);

module.exports = {
    getOffersForUsers,
    getOffersForAdmin,
    getUserOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOne
}