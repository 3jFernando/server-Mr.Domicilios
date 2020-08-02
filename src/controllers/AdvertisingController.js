const Advertising = require('../models/Advertising');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Shop = require('../models/Shop');

class AdvertisingController {

  store = async (req, res) => {

    try {

      const advertising = new Advertising();

      advertising.date_finish = req.body.date_finish;
      advertising.shop_id = req.body.shop_id;
      advertising.type = req.body.type;
      advertising.entity_id = req.body.entity_id;
      advertising.disscount = req.body.disscount;

      if (req.file) advertising.image = `/uploads/advertising/${req.file.originalname}`;

      await advertising.save();

      return res.status(200).json({ 'status': 200, 'advertising': advertising });
    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

  getByShop = async (req, res) => {

    try {
      const categories = await Category.find({ shop_id: req.params.id });
      const products = await Product.find({ shop_id: req.params.id });
      const advertisingsData = await Advertising.find({ shop_id: req.params.id });

      const advertisings = [];
      advertisingsData.map(item => {

        // buscar el nombre de la entidad
        const entityFind = item.type === 'Producto' ?
          products.filter(p => p._id == item.entity_id) :
          categories.filter(c => c._id == item.entity_id);

        advertisings.push({
          _id: item._id,
          date_created: item.date_created,
          date_finish: item.date_finish,
          shop_id: item.shop_id,
          type: item.type,
          entity_id: item.entity_id,
          image: item.image,
          name: entityFind ? (entityFind.length > 0 ? entityFind[0].name : 'No definido') : 'No definido'
        });
      });

      return res.status(200).json({ 'status': 200, 'advertisings': advertisings });
    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

  getAll = async (req, res) => {

    try {
      const categories = await Category.find();
      const products = await Product.find();
      const shops = await Shop.find();
      const advertisingsData = await Advertising.find();

      const advertisings = [];
      advertisingsData.map(item => {

        // buscar el nombre de la entidad
        const entityFind = item.type === 'Producto' ?
          products.filter(p => p._id == item.entity_id) :
          categories.filter(c => c._id == item.entity_id);

        // tienda
        const shop = shops.filter(s => s._id == item.shop_id);

        advertisings.push({
          _id: item._id,
          date_created: item.date_created,
          date_finish: item.date_finish,
          shop_id: item.shop_id,
          type: item.type,
          disscount: item.disscount,
          entity: entityFind ? (entityFind.length > 0 ? entityFind[0] : null) : null,
          shop: shop ? (shop.length > 0 ? shop[0] : null) : null,
          image: item.image
        });

      });

      return res.status(200).json({ 'status': 200, 'advertisings': advertisings });
    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

  destroy = async (req, res) => {

    try {
      const advertising = await Advertising.findOneAndDelete({ _id: req.params.id });
      if (!advertising) return res.status(200).json({ 'status': 460, 'message': 'El item esta presentando problemas.' });

      return res.status(200).json({ 'status': 200, 'advertising': advertising });
    } catch (e) { return res.status(500).json({ 'status': 500, 'error': e }); }

  }

}

const advertisingController = new AdvertisingController();
module.exports = advertisingController;