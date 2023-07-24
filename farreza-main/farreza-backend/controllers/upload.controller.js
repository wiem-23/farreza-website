const mongoose = require("mongoose");
// const { GFS } = require("../config/gridfs");
const BrandModel = require('../models/Brand')
const CategoryModel = require('../models/Category')
const ColorModel = require('../models/Color')
const OfferModel = require('../models/Offer')
const UserModel = require('../models/User')
const SubscriptionModel = require('../models/Subscription')
const TransactionModel = require('../models/Transaction')
const ReclamationModel = require('../models/Reclamation')

const GridFsBucketName = "uploads"
let GFS
mongoose.connection.once("open", () => {
    console.log(`MongoDB connected!`);
    GFS = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: GridFsBucketName });
});


/**
* GET file by id
* @param id file id
* @return file
*/
const findFileById = async (req, res) => {
    GFS.find({
        _id: mongoose.Types.ObjectId(req.params.id),
    })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist",
                });
            }
            GFS.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
        });
};
/**
 * POST uploading doc image
 * @param id doc id
 */
const uploadFile = async (req, res) => {
    try {
        console.log("req.params.id :", req.params.id);
        console.log("req.params.model :", req.params.model);

        var Model
        switch (req?.params?.model.toString()) {
            case "brands":
                Model = BrandModel;
                console.log("Model = BrandModel");
                break;
            case "categories":
                Model = CategoryModel;
                console.log("Model = CategoryModel");
                break;
            case "colors":
                Model = ColorModel;
                console.log("Model = ColorModel");
                break;
            case "offers":
                Model = OfferModel;
                console.log("Model = OfferModel");
                break;
            case "users":
                Model = UserModel;
                console.log("Model = UserModel");
                break;
            case "subscriptions":
                Model = SubscriptionModel;
                console.log("Model = SubscriptionModel");
                break;
            case "transactions":
                Model = TransactionModel;
                console.log("Model = TransactionModel");
                break;
            case "reclamations":
                Model = ReclamationModel;
                console.log("Model = ReclamationModel");
                break;
        }
        Model
            .findById(req.params.id)
            .then((doc) => {
                console.log("doc");
                console.log("req.files[0].id :", req.files[0].id);
                const { multiple } = req.query
                console.log("multiple :");
                console.log("multiple :", multiple);
                if (multiple) {
                    console.log("multiple is valid :", multiple);
                    console.log("doc.product_pictures :", doc.product_pictures);
                    if (!doc.product_pictures && !doc.product_pictures.length) {
                        console.log("product_pictures is empty.");
                        doc.product_pictures = []
                        console.log("product_pictures initialized.");
                    }
                    console.log("doc.product_pictures after init:", doc.product_pictures);
                    console.log("pushing req.files[0].id into product_pictures...");
                    doc.product_pictures.push(req.files[0].id)
                    if (doc.product_pictures && doc.product_pictures.length > 8) {
                        res.status(400).json({ message: "Le nombre de photos ne doit pas dépasser 8.", code: 10 })
                    }
                    console.log("doc.product_pictures after pushing:", doc.product_pictures);
                    console.log("req.files[0].id pushed into product_pictures :", req.files[0].id);
                }
                else if (!doc.img || doc.img === "") doc.img = req.files[0].id;
                else {
                    console.log("delete section");
                    GFS.delete(new mongoose.Types.ObjectId(doc.img), (err, data) => {
                        if (err) {
                            console.log("delete section error :", JSON.stringify(err.message));
                        }
                    });
                    doc.img = req.files[0].id;
                }
                doc.save()
                    .then((savedDoc) => res.status(200).json(savedDoc))
                    .catch((err) => res.json(err));
            })
            .catch((err) => res.status(400).json(`Error finding doc: ${err}`));
    } catch (error) {
        console.error("Method : uploadFile Error :", error);
    }
};

/**
* DELETE file by id
* @param id file id
* @return status 204
*/
const deleteFileById = async (req, res) => {
    try {
        console.log("deleteFileById");
        console.log("Checking if file exists ...");
        console.log("File exists. deleting file ...");
        if (req.query.product) {
            OfferModel.findById(new mongoose.Types.ObjectId(req.query.product))
                .then(async (doc) => {
                    console.log("doc");
                    const index = doc.product_pictures.findIndex(x => x.toString() == req.params.id.toString())
                    if (index >= 0) {
                        doc.product_pictures.splice(index, 1)
                        doc.markModified("product_pictures")
                        await doc.save()
                    }
                }).catch(err => {
                    console.log("err :", err)
                })
        }
        return GFS.delete(new mongoose.Types.ObjectId(req.params.id)).then(() => {
            console.log("file deleted.")
            res.status(200).json({ message: "file deleted.", code: 200 })
        }).catch(err => {
            console.log("delete section error :", JSON.stringify(err.message));
            res.status(500).json(("delete section error :" + JSON.stringify(err.message)))
        })
    } catch (error) {
        console.log("error :", error);
        res.status(500)
    }
};

module.exports = {
    findFileById,
    uploadFile,
    deleteFileById
}

