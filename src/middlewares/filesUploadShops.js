const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads/shops'),
  filename: (err, file, cb) => {
    cb(null, file.originalname);
  }
});

const filesUploadShops = multer({
  storage,
  dest: path.join(__dirname, '../../public/uploads/shops')
}).single('photo');

module.exports = filesUploadShops;