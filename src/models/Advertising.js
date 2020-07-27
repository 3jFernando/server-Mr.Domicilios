const mongoose = require('mongoose');

const schema = mongoose.Schema({
  date_created: {
    type: Date,
    default: new Date()
  },
  date_finish: {
    type: Date,
    default: new Date()
  },
  shop_id: String,
  type: {
    type: String,
    default: 'Producto'
  },
  entity_id: String,
  image: String,
  disscount: {
    type: Number,
    default: 0
  }
});

const Advertising = mongoose.model('advertising', schema);
module.exports = Advertising;