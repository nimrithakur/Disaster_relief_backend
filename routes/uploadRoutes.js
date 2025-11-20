const express = require("express");
const upload = require("../utils/upload.js");

const router = express.Router();

router.post("/upload-image", upload.single("image"), (req, res) => {
  res.json({
    message: "Uploaded successfully!",
    imageUrl: req.file.path,   // Here is the Cloudinary URL
  });
});

module.exports = router;
