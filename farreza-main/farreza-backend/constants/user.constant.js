const { ADMIN, VENDOR } = require("./roles.constant");
const UserStatues = [ADMIN, VENDOR];
module.exports = {
    UserStatues,
    UserModelName: "User",
    UserCollectionName: "users"
}