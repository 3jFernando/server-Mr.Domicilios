const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads/products'),
  filename: (req, file, cb) => {
    //cb(null,  `${uuid.v4()}${path.extname(file.originalname)}`);
    cb(null,  file.originalname);
  }
});
const filesUploadProducts = multer({
  storage: storage,
  dest: path.join(__dirname, '../../public/uploads/products')
})
.single('image');

module.exports = filesUploadProducts;