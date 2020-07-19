const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  price: String,
  description: String,
  cant: String,
  category: String,
  image: String,
  shop_id: String
});

const Product = mongoose.model('products', schema);
module.exports = Product;