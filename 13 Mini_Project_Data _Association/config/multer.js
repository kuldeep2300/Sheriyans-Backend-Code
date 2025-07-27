const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

// MULTER SETUP FOR FILE UPLOADS
// Diskstorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, buffer) => {
      const fn = buffer.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

// Export upload
const upload = multer({ storage: storage });
module.exports = upload;