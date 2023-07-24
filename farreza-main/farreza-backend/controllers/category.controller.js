const { Types } = require("mongoose");
const { CategoryCollectionName } = require("../constants/category.constant");
const Model = require("../models/Category");
const { getAllModels, getOneModel, createModel, updateModel, deleteModel } = require('../repositories/factory.repository')
const getDocsForUsers = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        if (req?.query?.title) {
            filter.title = new RegExp(req.query.title, "i");
        }
        filter.enabled = true;
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
        const docs = await Model.find(filter, { '_id': 1, 'name': 1 })
            .sort(sort)
            .limit(numberOfResults)
            .skip(pages)
            .populate({ "path": "parentId" }, { "name": 1 })
        const counter = await Model.countDocuments(filter);
        res.status(200).json({ docs, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const getDocsForAdmin = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
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
        } else {
            sort._id = 1
        }

        const docs = await Model.aggregate([
            { '$match': filter },
            {
                '$lookup': {
                    'from': CategoryCollectionName,
                    'localField': 'parentId',
                    'foreignField': '_id',
                    'as': 'parentId'
                }
            },
            {
                '$unwind': {
                    'path': "$parentId",
                    'preserveNullAndEmptyArrays': true
                }
            },
            { '$sort': sort },
            { '$limit': numberOfResults },
            { '$skip': pages }
        ])
        const counter = await Model.countDocuments(filter);
        res.status(200).json({ docs, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
const getParentDocsForAdmin = async (req, res) => {
    try {
        const { from } = req.query
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req?.query?.limit) : 10;
        if (req.query.title) {
            filter.title = new RegExp(req.query.title, "i");
        }
        if (req.query.enabled) {
            filter.enabled = req.query.enabled;
        } else {
            filter.enabled = true
        }
        filter.parentId = { $eq: null }
        if (from && from != undefined && from != "undefined") filter._id = { $ne: new Types.ObjectId(from) }
        if (req?.query?.page) {
            pages = Number(req.query.page);
        }
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.title = 1;
            } else if (req.query.sort === "desc") {
                sort.title = -1;
            }
        } else {
            sort._id = 1;
        }
        const docs = await Model.aggregate([
            // {
            //     '$lookup': {
            //         'from': CategoryCollectionName,
            //         'localField': '_id',
            //         'foreignField': 'parentId',
            //         'as': 'parentId'
            //     }
            // },
            {
                '$graphLookup': {
                    'from': CategoryCollectionName,
                    'startWith': "$_id",
                    'connectFromField': "_id",
                    'connectToField': "parentId",
                    'as': "children"
                }
            },
            { '$match': filter },
            { '$sort': sort },
            { '$limit': numberOfResults },
            { '$skip': pages }
        ])
        const counter = await Model.countDocuments(filter);
        res.status(200).json({ docs, counter });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

const getAll = getAllModels(Model);
const getOne = getOneModel(Model);
const create = createModel(Model);
const update = updateModel(Model);
const deleteOne = deleteModel(Model);

module.exports = {
    getAll,
    getDocsForUsers,
    getDocsForAdmin,
    getParentDocsForAdmin,
    getOne,
    create,
    update,
    deleteOne
}