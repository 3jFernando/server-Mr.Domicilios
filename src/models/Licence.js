const mongoose = require('mongoose');

const schema = mongoose.Schema({
  shop_id: String,
  created_at: {
    type: Date,
    default: new Date
  },
  type: {
    type: String,
    default: 'Basica' // Basica // Premium
  },
  state: {
    type: String,
    default: 'Activa' // Activa // Inactiva
  },
});

const Licence = mongoose.model('licences', schema);
module.exports = Licence;