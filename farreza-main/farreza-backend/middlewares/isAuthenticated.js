const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log("isAuthenticated");
  if (req.headers.authorization) {
    console.log("req.headers.authorization");
    /* Replacing the word "Bearer" with an empty string. */
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log("token");
    /* Finding the user in the database by the token. */
    const user = await User.findOne({ token: token }).select("email account _id role");
    console.log("user");
    if (user) {
      console.log("valid user");
      req.user = user;
      return next();
    } else {
      console.log("Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    console.log("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
