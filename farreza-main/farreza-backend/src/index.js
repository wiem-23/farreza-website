
/*
 * Import express
*/
// const express = require("express");
const express = require("express");
/*
 * Import And Configure dotenv
*/
require("dotenv").config({ path: '../.env' });
/*
 * Import cors
*/
// const cors = require("cors");
const cors = require('cors');
/*
 * Import formidable
*/
const formidable = require("express-formidable");
/*
 * Import helmet
*/
const helmet = require("helmet");
/*
 * Import i18next
*/
// const i18next = require("../utils/i18n.js");
const i18next = require("../utils/i18n.js");
/*
 * Import i18next-http-middleware
*/
const middleware = require("i18next-http-middleware");
/*
 * Instanciate express
*/
const app = express();
/*
 * Use cors
*/
app.use(cors());


const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


/*
 * Use formidable
*/
// app.use(formidable({ multiples: true }));
/*
 * Use helmet
*/
app.use(helmet());
/*
 * Use i18next
*/
app.use(middleware.handle(i18next));
/*
* Database Connection
*/
require("../config/connection");
/*
* Seeding Admin
*/
require("../seeds/user.seed.js");
require("../seeds/parameter.seed.js");
/*
* Importing Routes
*/
const userRoutes = require("../routes/user.route");
const offerRoutes = require("../routes/offer.route");
const orderRoutes = require("../routes/order.route");
const brandRoutes = require("../routes/brand.route");
const uploadRoutes = require("../routes/upload.route");
const categoryRoutes = require("../routes/category.route");
const colorRoutes = require("../routes/color.route");
const subscriptionRoutes = require("../routes/subscription.route");
const transactionRoutes = require("../routes/transaction.route");
const reclamationRoutes = require("../routes/reclamation.route");
const parameterRoutes = require("../routes/parameter.route");
const wishRoutes = require("../routes/wish.route");
/*
* Use Routes
*/
app.use("/user", userRoutes);
app.use("/offers", offerRoutes);
app.use("/orders", orderRoutes);
app.use("/brands", brandRoutes);
app.use("/documents", uploadRoutes);
app.use("/categories", categoryRoutes);
app.use("/colors", colorRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reclamations", reclamationRoutes);
app.use("/parameters", parameterRoutes);
app.use("/wishs", wishRoutes);
/*
 * Default Get Endpoint
*/
app.get("/", (req, res) => {
  res.json("Bienvenue sur l'API");
});
/*
 * Default Not Found Endpoint
*/
app.all("*", (req, res) => {
  res.status(404).json({
    message: "This route does not exist",
  });
});
/*
 * Start server
*/
app.listen(4000, () => {
  console.log(`Server launched on :${4000}`);
});
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/farreza.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/farreza.com/fullchain.pem')
};

https.createServer(options, app).listen(5000);