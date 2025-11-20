const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "disaster-relief-app",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
