const mongoose = require('mongoose');

const schema = mongoose.Schema({
  created_at: {
    type: Date,
    default: new Date()
  },
  entity_type: {
    type: String,
    default: 'Producto' // Tienda,    
  },
  entity_id: String,
  review: {
    type: String,
    default: ''
  },
  current_id: String,
  name: {
    type: String,
    default: 'Anonimo'
  },
  photo: {
    type: String,
    default: null
  },
  likes: {
    type: Number,
    default: 1
  }
});

const Review = mongoose.model('reviews', schema);
module.exports = Review;