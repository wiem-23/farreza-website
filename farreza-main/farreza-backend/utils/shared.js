const logger = require('../config/log/logger').logger;
const path = require("path")

// module.exports.getFileName = () => path.dirname(__filename);
module.exports.getFileName = () => "";
module.exports.BuildAggregationOptions = (req) => {
    var pageNumber = 0;
    if (req?.query?.page) {
        pageNumber = Number(req?.query?.page);
    }
    var limitNumber = 10;  // default value 10
    if (req?.query?.limit) {
        limitNumber = Number(req?.query?.limit);
    }

    var sort = {}
    if (req?.query?.sortBy && req?.query?.orderBy) {
        sort[req.query.sortBy] = req.query.orderBy === 'desc' ? -1 : 1
    }

    logger.info(sort.length);
    logger.info("Method : BuildAggregationOptions, message : building aggregation ...");
    var aggregation = [
        {
            '$facet': {
                'totalData': [
                    {
                        '$sort': Object.keys(sort).length ? sort : { '_id': 1 }, //asc 1 // desc-1
                    },
                    {
                        '$skip': Math.floor(pageNumber * limitNumber),
                    },
                    {
                        '$limit': limitNumber,
                    },
                ],
                'totalCount': [
                    {
                        '$count': 'count'
                    }
                ]
            }
        }
    ]
    return aggregation
}