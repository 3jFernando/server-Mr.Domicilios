const bcrypt = require('bcryptjs');
const getSaltHashPassword = require('../utils/hash_password');

// modelo tienda
const Shop = require('../models/Shop');

// api categoiras de las tiendas
const CATEGORYS = require('../utils/categorys_shops.json');

// controladores
const licenceController = require('./LicencesController');
const Licence = require('../models/Licence');

class ShopsController {

  store = async (req, res) => {

    try {

      let shop = null;
      // verificar que el email SI SE ESTA creando
      if(req.body.action === 'CREATE') {
        const shopEmail = await Shop.findOne({ email: req.body.email });
        if (shopEmail) return res.status(200).json({ 'shop': null, 'status': 460, 'message': "La direccion de correo electronico ingresada ya existe." });  
        
        // crear
        shop = new Shop();

        // encriptar la clave
        const hastPassword = await getSaltHashPassword(req.body.password);
        shop.password = hastPassword;      

        //shop.address_lat = req.body.address_lat;
        //shop.address_lgn = req.body.address_lgn;        
      } else {

        shop = await Shop.findById(req.body._id);
        if (!shop) return res.status(200).json({ 'shop': null, 'status': 460, 'message': "Esta tienda esta presentando problemas, por favor reinicia tu sesion." });  
        if(req.file) shop.photo = `/uploads/shops/${req.file.originalname}`;
      
      }
      
      // actualizar campo adicionales de la tienda
      if(req.body.action_type === 'OTHERS') {
        
        shop.value_delivery = req.body.value_delivery;
        shop.time_type = req.body.time_type;
        shop.time_number = req.body.time_number;
        shop.categories_shops = req.body.categories_shops;
      } else { // actualiiar o guardar datos basicos
        
        shop.name = req.body.name;
        shop.phone = req.body.phone;
        shop.email = req.body.email;
      }
      
      await shop.save();

      // crear licencia      
      if(req.body.action === 'CREATE') licenceController.store(shop._id);      

      return res.status(200).json({ 'shop': shop, 'status': 200 });

    } catch (e) {
      return res.status(500).json({ 'shop': null, 'error': e, 'status': 500 });
    }

  }

  all = async (req, res) => {

    try {
      const shops = await Shop.find({});

      return res.status(200).json({ 'shops': shops, 'status': 200 });

    } catch (e) {
      return res.status(500).json({ 'shops': null, 'error': e, 'status': 500 });
    }

  }

  getByCategory = async (req, res) => {

    const shopAll = await Shop.find({});
    const shops = [];
    const category = CATEGORYS.filter(ct => ct.id == req.params.idCategory);

    if (category.length > 0) {

      shopAll.map(shop => {
        const categories_shops = JSON.parse(shop.categories_shops);
        const searching = categories_shops.filter(c => c.id == category[0].id);

        // encuentra algo la agrega 
        if (searching.length > 0) shops.push(shop);
      });

      return res.status(200).json({ 'category': category, 'shops': shops, 'cant': shops.length, 'status': 200 });
    } else {
      return res.status(200).json({ 'category': null, 'shops': null, 'status': 500 });
    }
  }

  login = async (req, res) => {

    // validar  email
    const shop = await Shop.findOne({ email: req.body.email });
    if (!shop) return res.status(200).json({ 'shop': req.body, 'status': 460, 'message': "Correo electronico no encontrado!" });

    // validar clave
    const checkPassword = await bcrypt.compare(req.body.password, shop.password);
    if (!checkPassword) return res.status(200).json({ 'shop': req.body, 'status': 470, 'message': "Contraseña incorrecta!" });

    let licence = await Licence.findOne({shop_id: shop._id});
    if(!licence) {
      await licenceController.store(shop._id);
      licence = await Licence.findOne({shop_id: shop._id});      
    }

    return res.status(200).json({ 'shop': shop, 'status': 200, 'licence':licence });
  } 

  search = async (req, res) => {

    try {
      const shopsAll = await Shop.find({});
            
      // filtrar
      function filter(query) {
        return shopsAll.filter(shop => shop.name.toLowerCase().indexOf(query.toLowerCase()) > -1);        
      }

      const shops = filter(req.body.query);
      return res.status(200).json({ 'shops': shops, 'status': 200 });

    } catch (e) {
      return res.status(500).json({ 'shops': null, 'error': e, 'status': 500 });
    }

  }

}

const shopsController = new ShopsController();
module.exports = shopsController;