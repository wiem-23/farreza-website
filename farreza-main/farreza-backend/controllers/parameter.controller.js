const Model = require("../models/Parameter");
const { getAllModels, getOneModel, createModel, updateModel, deleteModel } = require('../repositories/factory.repository')
const getDocsForUsers = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req.query.limit) : 10;
        if (req.query.title) {
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
        const docs = await Model.find(filter, { '_id': 1, 'title': 1, 'key': 1, 'value': 1 })
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
const getDocsForAdmin = async (req, res) => {
    try {
        let filter = {};
        let sort = {};
        let pages = 0;
        const numberOfResults = req?.query?.limit ? Number(req.query.limit) : 10;
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

const getAll = getAllModels(Model);
const getOne = getOneModel(Model);
const create = createModel(Model);
const update = updateModel(Model);
const deleteOne = deleteModel(Model);

module.exports = {
    getAll,
    getDocsForUsers,
    getDocsForAdmin,
    getOne,
    create,
    update,
    deleteOne
}