const { getFileName } = require("../utils/shared")
const { logProvider, LOGTYPE } = require("../config/log/log.methodss")
const { db } = require("../config/connection");

const aggregate = async (collectionName, aggregation = []) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: aggregate.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).aggregate(aggregation).maxTimeMS(40000)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: aggregate.name,
            args: { collectionName },
            error: error
        })
    }
};
const find = async (collectionName, filter = {}, options = {}) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: find.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).find(filter, options).maxTimeMS(40000)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: find.name,
            args: { collectionName },
            error: error
        })
    }
};
const findOne = async (collectionName, filter = {}) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: findOne.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).findOne(filter)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: findOne.name,
            args: { collectionName },
            error: error
        })
    }
};
const save = async (collectionName, entity) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: save.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).save(entity)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: save.name,
            args: { collectionName },
            error: error
        })
    }
};
const updateOne = async (collectionName, filter = {}, options = {}) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: updateOne.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).updateOne(filter, options)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: updateOne.name,
            args: { collectionName },
            error: error
        })
    }
};
const deleteOne = async (collectionName, query = {}, options = {}) => {
    try {
        logProvider({
            logtype: LOGTYPE.info,
            location: getFileName(),
            method: deleteOne.name,
            args: { collectionName }
        })
        return await db.collection(collectionName).deleteOne(query, options)
    } catch (error) {
        logProvider({
            logtype: LOGTYPE.error,
            location: getFileName(),
            method: deleteOne.name,
            args: { collectionName },
            error: error
        })
    }
};

module.exports = {
    aggregate,
    find,
    findOne,
    save,
    updateOne,
    deleteOne
}