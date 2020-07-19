const Category = require('../models/Category');

class CategorysController {

  // crear categorias
  store = async (req, res) => {

    try {

      const category = new Category();

      category.name = req.body.name;
      category.image = req.body.image;
      category.shop_id = req.body.shop_id;

      await category.save();
      return res.status(200).json({'category': category, 'status': 200});

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

}

const categorysController = new CategorysController();
module.exports = categorysController;