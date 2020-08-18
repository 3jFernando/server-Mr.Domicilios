const Licence = require('../models/Licence');

class LicencesController {

  // crear licencia
  store = async (_id) => {

    try {

      const licence = new Licence();
      licence.shop_id = _id;
      await licence.save();
    } catch (e) { }
  }

  // cargar licencia por tienda
  getLicence = async (req, res) => {
    try {

      const licence = Licence.findById(req.params.shop_id);
      if (!licence) return res.status(200).json({ 'status': 460 });

      return res.status(200).json({ 'status': 200, licence });
    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }
  }

}

const licencesController = new LicencesController();
module.exports = licencesController;