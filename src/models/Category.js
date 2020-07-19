const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  image: String,
  shop_id: String
});

const Category = mongoose.model('categories', schema);
module.exports = Category;