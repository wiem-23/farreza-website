const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");

const GridFsBucketName = "uploads"
let GFS
mongoose.connection.once("open", () => {
    console.log(`MongoDB connected!`);
    GFS = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: GridFsBucketName });
});

const storage = new GridFsStorage({
    url: process.env.DB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: GridFsBucketName
                };
                resolve(fileInfo);
            });
        });
    },
});
const GFSUpload = multer({ storage: storage });

module.exports = {
    GFS,
    GFSUpload,
}