const { logger } = require('../log/logger')
const LOGTYPE = {
    info: "info",
    warn: "warn",
    error: "error",
    debug: "debug",
    verbose: "verbose",
}
const logProvider = ({
    logtype,
    location,
    method,
    message,
    error,
    extra,
    args,
    result
}) => {
    if ([LOGTYPE.info, LOGTYPE.warn, LOGTYPE.error, LOGTYPE.debug, LOGTYPE.verbose].includes(logtype)) {
        var data = { timestamp: new Date() }
        if (logtype) data.logtype = logtype;
        if (location) data.location = location;
        if (method) data.method = method;
        if (message) data.message = message;
        if (error) data.error = error;
        if (extra) data.extra = extra;
        if (args) data.args = args;
        if (result) data.result = result;
        logger[logtype](data)
    }
}

module.exports = {
    LOGTYPE,
    logProvider,
};