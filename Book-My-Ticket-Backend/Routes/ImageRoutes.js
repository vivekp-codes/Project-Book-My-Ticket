const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/Cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "BookMyTicket",
      format: file.mimetype.split("/")[1], // jpg/png/jpeg
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    res.status(200).json({
      message: "Image Uploaded",
      url: req.file.path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

module.exports = router;