const mongoose = require('mongoose');

const schema = mongoose.Schema({
  client_id: String,
  type: {
    type: String,
    default: 'Producto' // Tienda
  },
  entity_id: String,
});

const Favorite = mongoose.model('favorites', schema);
module.exports = Favorite;