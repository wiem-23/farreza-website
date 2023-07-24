const express = require("express");
const router = express.Router();
const { GFSUpload } = require("../config/gridfs");
const { uploadFile, findFileById, deleteFileById } = require("../controllers/upload.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/:id", findFileById);
router.post("/upload/:model/:id", GFSUpload.array("document", 1), isAuthenticated, uploadFile);
router.post("/publish", GFSUpload.array("document", 1), isAuthenticated, uploadFile);
router.delete("/:id", deleteFileById);

module.exports = router;