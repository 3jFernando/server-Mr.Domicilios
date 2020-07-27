const multer = require('multer');
const path = require('path');

const pathFiles = path.join(__dirname, '../../public/uploads/advertising');
const storage = multer.diskStorage({
  destination: pathFiles,
  filename: (err, file, cb) => cb(null, file.originalname)
});

const filesUploadAdvertising = multer({
  storage,
  dest: pathFiles,
}).single('image');

module.exports = filesUploadAdvertising;