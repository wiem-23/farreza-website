const { logger } = require('../config/log/logger')
const { BuildAggregationOptions } = require('../utils/shared');
const { Offer } = require('../models/Offer');
const { User } = require('../models/User');

const getAllModels = (Model) => async (req, res) => {
    try {
        var aggregation = BuildAggregationOptions(req);
        aggregation.unshift({
            '$match': {
                'enabled': true
            }
        })

        var filterValue = ''
        if (req.query?.filter) {
            filterValue = req.query.filter
            console.log(filterValue)

            switch (Model) {
                case User:
                    query = [
                        { 'email': { $regex: filterValue, $options: 'i' } },
                        { 'account.username': { $regex: filterValue, $options: 'i' } },
                        { 'role': { $regex: filterValue, $options: 'i' } },
                    ];
                    break;
                case Offer:
                    query = [
                        { 'product_name': { $regex: filterValue, $options: 'i' } },
                        { 'product_description': { $regex: filterValue, $options: 'i' } },
                        { 'product_price': { $regex: filterValue, $options: 'i' } },
                        { 'product_status': { $regex: filterValue, $options: 'i' } }
                    ];
            }
            aggregation.unshift(
                {
                    $match: {
                        $or: query
                    }
                }
            )
        }
        const objects = await Model.aggregate(aggregation)
        if (!objects || !objects.length) return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
        res.status(200).json({
            response: objects?.length ? objects[0] : [{ totalCount: [], totalData: [] }],
            message: req.t("SUCCESS.RETRIEVED")
        })
    } catch (e) {
        logger.error(`Error in getAllModels() function`, e)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        });
    }
}

const getOneModel = (Model) => async (req, res) => {
    try {
        const { id } = req.params;
        const object = await Model.findById(id);
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.RETRIEVED")
                }
            );
    } catch (e) {
        logger.error(`Error in getOneModel() function`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }

}

const createModel = (Model) => async (req, res) => {
    try {
        logger.info("Create One");
        logger.info("Model :", Model.modelName);
        console.log("\n**** ", req.body, " *********\n");
        if (req?.user?._id) {
            req.body["owner"] = req?.user?._id
        }
        const entity = new Model(req.body);
        logger.info("Object :", entity);
        await entity.save();
        logger.info("Saved :", entity);
        res.status(201).json({ response: entity, message: req.t("SUCCESS.CREATED") })
    } catch (e) {
        logger.error(`Error in createModel() function: ${e.message}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }
}

const updateModel = (Model) => async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const entity = await Model.findById(id);
        if (!entity) return res.sendStatus(404);
        updates.forEach(update => {
            entity[update] = req.body[update];
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

const deleteModel = (Model) => async (req, res) => {
    try {
        const id = req.params.id;
        console.log("delete Model");
        // const object = await Model.findByIdAndDelete(id);
        const object = await Model.findById(id);
        console.log("object :", object);
        if (!object) res.send(404)
        object.enabled = false;
        object.markModified('enabled')
        await object.save()
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
    getAllModels,
    getOneModel,
    createModel,
    updateModel,
    deleteModel
}
