const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

class FavoritesController {

  // crear favoritos para los clientes
  async store(req, res) {

    try {
      
      const favoriteExist = await Favorite.findOne({ 
        client_id: req.body.client_id,  
        entity_id: req.body.entity_id
      });
      
      let action = false;
      if(favoriteExist) {
        await favoriteExist.delete();
      } else {     
        action = true;
        const favorite = new Favorite();

        favorite.client_id = req.body.client_id;
        favorite.type = req.body.type; // Producto // Tienda
        favorite.entity_id = req.body.entity_id;          

        await favorite.save();
      }

      return res.status(200).json({ 'status': 200, 'action': action });
    } catch(e) {
      console.log(e);
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

  // cargar los favoritos por cliente
  async getByClient(req, res) {

    try {

      const favorites = [];
      const favoritesData = await Favorite.find({ client_id: req.params.id });
      const products = await Product.find();
      const shops = await Shop.find();

      favoritesData.map(favorite => {

        // producto o tienda 
        const entitySearch = 
          (favorite.type === 'Producto') ? 
          products.filter(p => p._id == favorite.entity_id) :
          shops.filter(s => s._id == favorite.entity_id);        

        // si la entidad existe
        if(entitySearch.length > 0) {

          const entity = entitySearch[0];

          // tienda donde pertence el producto           
          const id_shop = favorite.type === 'Producto' ? entity.shop_id : entity._id;
          const shopSearch = shops.filter(x => x._id == id_shop);
          const shop = shopSearch.length > 0 ? shopSearch[0] : null;

          favorites.push({
            _id: favorite._id,
            type: favorite.type,
            entity,
            shop
          });
        }        
      });

      return res.status(200).json({ 'status': 200, 'favorites': favorites });
    } catch(e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

}

const favoritesController = new FavoritesController();
module.exports = favoritesController;