const multer = require('multer');

const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const maxSize = 2 * 1024 * 1024;
const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
  limits: { fieldSize: maxSize },
});

// const uploadProfile = upload.single("profilePic");

exports.uploadUserProfile = (req, res, next) => {
  upload.single("profilePic")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(404).send(err + "Upload failed due to multer error");
    } else if (err) {
      console.log(err);
      return res.status(404).send(err + "Upload failed due to unknown error");
    }
    // console.log("Every thing is fine with Fine Uploading");
    next();
  });
};
