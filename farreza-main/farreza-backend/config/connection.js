const { connect, connection } = require("mongoose");

connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

module.exports = {
    db: connection.db,
}
