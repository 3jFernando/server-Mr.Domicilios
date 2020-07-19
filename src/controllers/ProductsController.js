const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductsController {

  // crear productos
  store = async (req, res) => {

    const action = req.body.action;

    try {

      let product = null;
      if(!action) { // crear
        
        product= new Product();
        product.shop_id = req.body.shop_id;

      } else { // modificar
        product = await Product.findOne({ _id: req.body._id });
        if(!product) {
          return res.status(200).json({'product': null, 'status': 460});
        }
      }      

      product.name = req.body.name;
      product.code = req.body.code || Math.random(10);
      product.price = req.body.price;
      product.description = req.body.description;
      product.cant = req.body.cant;
      product.category = req.body.category;
      product.image = req.body.image;

      await product.save();
      return res.status(200).json({'product': product, 'status': 200, 'action': action });

    } catch(e) {
      return res.status(500).json({'product': null, 'error': e, 'status': 500});
    }

  }

  // ver productos de una tienda -> se cargan agrupados por su categoria
  getGroupByCategoryByShop = async (req, res) => {

    try {
      // por tienda -> id: id_tienda
      const products = [];
      const productsData = await Product.find({shop_id: req.params.id});

      // agrupados por categoria
      const categorys = await Category.find({shop_id: req.params.id});
      categorys.map(category => {

        // items -> productos de la categoria
        const items = productsData.filter(p => p.category == category._id);

        products.push({
          category: category.name,
          data: items
        });
      });

      return res.status(200).json({'products': products, 'cant': products.length, 'status': 200 });
    } catch(e) {
      return res.status(500).json({'products': null, 'error': e, 'status': 500});
    }

  }

  // ver productos de una tienda
  getByShop = async (req, res) => {

    try {
      
      const products = await Product.find({ shop_id: req.params.id });
      const categories = await Category.find({ shop_id: req.params.id });

      return res.status(200).json({'products': products, 'categories': categories, 'cant': products.length, 'status': 200 });
    } catch(e) {
      return res.status(500).json({'products': null, 'error': e, 'status': 500});
    }

  }

}

const productsController = new ProductsController();
module.exports = productsController;