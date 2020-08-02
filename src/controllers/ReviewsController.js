const Review = require('../models/Review');

class ReviewsController {

  // crear opinion a la entidad // producto/tienda
  store = async (req, res) => {
    try {

      const review = new Review();

      review.entity_type = req.body.entity_type;
      review.entity_id = req.body.entity_id;
      review.review = req.body.review;
      // datos cliente
      review.name = req.body.name;
      review.photo = req.body.photo;

      await review.save();

      return res.status(200).json({'status': 200, 'review':review});
    } catch(e) {
      return res.status(500).json({'status': 500, 'error':e});
    }
  }

  // cargar opiniones de una entidad
  getByEntity = async (req, res) => {
    try {
      const reviews = await Review.find({entity_id: req.params.id});

      return res.status(200).json({'status': 200, 'reviews':reviews});
    } catch(e) {
      return res.status(500).json({'status': 500, 'error':e});
    }
  }

}

const reviewsController = new ReviewsController();
module.exports = reviewsController;