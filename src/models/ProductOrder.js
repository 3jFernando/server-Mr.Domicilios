const mongoose = require('mongoose');

const schema = mongoose.Schema({
  order_id: String,
  product_id: String,
  value_unit: {
    type: String,
    default: 0
  },
  cant: String,
  total: {
    type: String,
    default: 0
  }
});

const ProductOrder = mongoose.model('products_orders', schema);
module.exports = ProductOrder;