const Category = require('../models/Category');
const Product = require('../models/Product');

class CategorysController {

  // crear categorias
  store = async (req, res) => {

    try {

      let category;
      if(req.body.action === true) {
        category = new Category();
        category.shop_id = req.body.shop_id;
      } else {
        category = await Category.findById(req.body._id);
        if(!category) return res.status(200).json({'category': null, 'status': 460});
      }
      
      category.name = req.body.name;
      category.image = req.body.image;      

      await category.save();
      return res.status(200).json({'category': category, 'status': 200, 'action': req.body.action});

    } catch(e) {
      return res.status(500).json({'category': null, 'error': e, 'status': 500});
    }

  }

  // cargar categorias de una tienda
  loadCategoryByShop = async (req, res) => {

    try {

      const categorys = await Category.find({shop_id: req.params.id});

      return res.status(200).json({'categorys': categorys, 'cant': categorys.length, 'status': 200});

    } catch(e) {
      return res.status(500).json({'categorys': null, 'error': e, 'status': 500});
    }

  }

  // eliminar categoria
  destroy = async (req, res) => {
    try {

      let category = await Category.findById(req.params.id);
      if(!category) return res.status(200).json({'category': null, 'status': 460});

      // validar que ningun producto la este usuando
      const products = await Product.find({ shop_id: category.shop_id });
      let isPermission = true;
      products.map(p => {
        // no se puede eliminar porque se esta usuando
        if(p.category == category._id) {
          isPermission = false;          
          return false;
        }
      });
      if(isPermission) {
        category.remove();
        return res.status(200).json({'category': category, 'status': 200});
      } else {
        return res.status(200).json({'category': category, 'status': 490});
      }

    } catch(e) {
      return res.status(500).json({'category': null, 'error': e, 'status': 500});
    }
  }

}

const categorysController = new CategorysController();
module.exports = categorysController;