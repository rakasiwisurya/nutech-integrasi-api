const multer = require("multer");

exports.uploadFile = (imageFile, location) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, location);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only PNG or JPG file are allowed",
        };

        return cb(new Error("Only PNG or JPG file are allowed"), false);
      }

      cb(null, true);
    }
  };

  const sizeKB = 100;
  const maxSize = sizeKB * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (error) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized is 10KB",
          });
        }
        return res.status(400).send(error);
      }

      return next();
    });
  };
};
