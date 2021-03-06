const {Router} = require('express');
const CATEGORIES = require('./utils/categorys_shops.json');
const router = Router();

// middlewares
const filesUploadProducts = require('./middlewares/filesUploadProducts');
const filesUploadShops = require('./middlewares/filesUploadShops');
const filesUploadAdvertising = require('./middlewares/filesUploadAdvertising');

// controlladores
const clientsController = require('./controllers/ClientsController');
const shopsController = require('./controllers/ShopsController');
const categorysController = require('./controllers/CategorysController');
const productsController = require('./controllers/ProductsController');
const ordersController = require('./controllers/OrdersController');
const inchargesController = require('./controllers/InchargesController');
const favoritesController = require('./controllers/FavoritesController');
const advertisingController = require('./controllers/AdvertisingController');
const reviewsController = require('./controllers/ReviewsController');
const licencesController = require('./controllers/LicencesController');

// clientes
router.get('/clients', clientsController.getAll);
router.post('/clients', clientsController.store);
router.post('/clients/login', clientsController.login);
router.put('/clients/:id', clientsController.update);

// tiendas
router.post('/shops', filesUploadShops, shopsController.store);
router.get('/shops', shopsController.all)
router.get('/shops/category/:idCategory', shopsController.getByCategory);
router.post('/shops/login', shopsController.login);
router.post('/shops/search', shopsController.search);

// licencias para las tiendas
router.get('/shops/licences/:id', licencesController.getLicence);

// productos
router.post('/products', filesUploadProducts, productsController.store);
router.get('/products/shop/by-cateogory/:id/:client_id', productsController.getGroupByCategoryByShop);
router.get('/products/shop/:id', productsController.getByShop);

// categorias de productos
router.post('/categorys', categorysController.store);
router.get('/categorys/shop/:id', categorysController.loadCategoryByShop);
router.delete('/categorys/:id', categorysController.destroy);

// categorias generales de las tiendas
router.get('/categories/generals', async (req, res) => {
  return res.status(200).json({ 'status': 200, 'categories': CATEGORIES })
});

// ordenes - domicilios
router.post('/orders', ordersController.store);
router.get('/orders/details/:id', ordersController.getDetails);
router.get('/orders/clients/:id', ordersController.getByClient);
router.get('/orders/shop/:id', ordersController.getOrdersByShop);
router.put('/orders/change-incharge', ordersController.updateIncharge);
router.put('/orders/visited/:id', ordersController.visited);
router.put('/orders/cancel', ordersController.cancel);

// domiciliarios
router.get('/incharges/shop/:id', inchargesController.getByShop);
router.post('/incharges', inchargesController.store);

// favoritos
router.post('/favorites/client', favoritesController.store);
router.get('/favorites/client/:id', favoritesController.getByClient);

// publicidades
router.post('/advertising', filesUploadAdvertising, advertisingController.store);
router.get('/advertising/shop/:id', advertisingController.getByShop);
router.get('/advertising/all', advertisingController.getAll);
router.delete('/advertising/:id', advertisingController.destroy);

// opiniones/reviews/comentarios -> productos/tiendas
router.post('/reviews', reviewsController.store);
router.get('/reviews/:id', reviewsController.getByEntity);
router.delete('/reviews/:id', reviewsController.destroy);

module.exports = router;