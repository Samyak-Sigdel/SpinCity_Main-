import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    // Prefix with timestamp to avoid overwriting files with the same name
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;