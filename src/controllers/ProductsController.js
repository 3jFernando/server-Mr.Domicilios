const Product = require('../models/Product');
const Category = require('../models/Category');
const Favorite = require('../models/Favorite');

class ProductsController {

  // crear productos
  store = async (req, res) => {

    const action = req.body.action;
    try {

      let product = null;
      if(action === 'false') { // crear
        
        product = new Product();
        product.shop_id = req.body.shop_id;    
        product.image = null;    

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
      
      if(req.file) product.image = `/uploads/products/${req.file.originalname}`;

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
      const favorites = await Favorite.find({ client_id: req.params.client_id });

      // agrupados por categoria
      const categorys = await Category.find({shop_id: req.params.id});
      categorys.map(category => {

        // items -> productos de la categoria
        const items = productsData.filter(p => p.category == category._id);
        const products_category = [];
        items.map(i => {

          // validar si es favorito del cliente
          const favorite = favorites.filter(f => f.entity_id == i._id);

          products_category.push({
            _id: i._id,
            name: i.name,
            price: i.price,
            description: i.description,
            cant: i.cant,
            category: i.category,
            image: i.image,
            shop_id: i.shop_id,
            favorite: favorite.length > 0 ? true : false
          });
        });

        products.push({
          category: category.name,
          data: products_category
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