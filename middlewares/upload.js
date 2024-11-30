// middlewares/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../src/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

const uploadMultiple = upload.fields([
  { name: "img", maxCount: 1 },
  { name: "fotos", maxCount: 5 },
]);

module.exports = { upload, uploadMultiple };
