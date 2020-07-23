const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => {
    //cb(null,  `${uuid.v4()}${path.extname(file.originalname)}`);
    cb(null,  file.originalname);
  }
});
const middlewareUploads = multer({
  storage: storage,
  dest: path.join(__dirname, '../../public/uploads')
})
.single('image');

module.exports = middlewareUploads;