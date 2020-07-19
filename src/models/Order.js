const mongoose = require('mongoose');

const schema = mongoose.Schema({
  shop_id: String,
  client_id: String,
  incharge_id: String,
  visited: {
    type: Boolean,
    default: false
  },
  state: {
    type: String,
    default: 'Activa'
  },
  value_delivery: {
    type: String,
    default: 0
  },
  total: {
    type: String,
    default: 0
  },  
  create_at: {
    type: Date,
    default: Date.now()
  }
});

const Order = mongoose.model('orders', schema);
module.exports = Order;