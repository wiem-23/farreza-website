const { Types } = require("mongoose");
const { ADMIN } = require("../constants/roles.constant");
const Model = require("../models/Wish");
const { createModel, deleteModel } = require('../repositories/factory.repository')
const getDocsForAdmin = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }
        if (req?.user?.role != ADMIN) {
            filter.owner = new Types.ObjectId(req.user._id)
        }

        const docs = await Model.find(filter, { '_id': 1, 'offer': 1 })
            .populate({ path: 'offer', select: { _id: 1, title: "$product_name", img: 1 } })
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
const create = createModel(Model);
const deleteOne = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("delete Model");
        // const object = await Model.findByIdAndDelete(id);
        const object = await Model.findByIdAndDelete(id);
        return res.json(
            {
                response: object,
                message: req.t("SUCCESS.DELETED")
            }
        );
    } catch (e) {
        logger.error(`Error in deleteModel() function: ${e}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        });
    }

}

module.exports = {
    getDocsForAdmin,
    create,
    deleteOne
}