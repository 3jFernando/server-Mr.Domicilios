const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  state: {
    type: String,
    default: 'Libre'
  },
  shop_id: String,
  address_lat: String,
  address_lgn: String,
});

const Incharge = mongoose.model('incharges', schema);
module.exports = Incharge;