const Incharge = require('../models/Incharge');
const { response } = require('express');

class InchargesController {

  // cargar domiciliarios por tiendas
  getByShop = async (req, res) => {

    try {
      const incharges = await Incharge.find({ shop_id: req.params.id });
      return res.status(200).json({'status': 200, 'incharges': incharges});
    } catch(e) {
      return res.status(500).json({'status': 500, 'error': e, 'incharges': null});
    }

  }

  // crear domiciliarios
  store = async (req, res) => {

    try {
      const incharge = new Incharge();

      incharge.name = req.body.name;
      incharge.shop_id = req.body.shop_id;

      await incharge.save();

      return res.status(200).json({'status': 200, 'incharge': incharge});
    } catch(e) {
      return res.status(500).json({'status': 500, 'error': e, 'incharge': null});
    }

  }

}

const inchargesController = new InchargesController();
module.exports = inchargesController;