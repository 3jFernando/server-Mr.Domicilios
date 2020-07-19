const {Router} = require('express');
const router = Router();

// controlladores
const clientsController = require('./controllers/ClientsController');
const shopsController = require('./controllers/ShopsController');
const categorysController = require('./controllers/CategorysController');
const productsController = require('./controllers/ProductsController');
const ordersController = require('./controllers/OrdersController');
const inchargesController = require('./controllers/InchargesController');

// clientes
router.get('/clients', clientsController.getAll);
router.post('/clients', clientsController.store);
router.post('/clients/login', clientsController.login);
router.put('/clients/:id', clientsController.update);

// tiendas
router.post('/shops', shopsController.store);
router.get('/shops', shopsController.all)
router.get('/shops/category/:idCategory', shopsController.getByCategory);
router.post('/shops/login', shopsController.login);

// productos
router.post('/products', productsController.store);
router.get('/products/shop/by-cateogory/:id', productsController.getGroupByCategoryByShop);
router.get('/products/shop/:id', productsController.getByShop);

// categorias de productos
router.post('/categorys', categorysController.store);
router.get('/categorys/shop/:id', categorysController.loadCategoryByShop);

// ordenes - domicilios
router.post('/orders', ordersController.store);
router.get('/orders/details/:id', ordersController.getDetails);
router.get('/orders/clients/:id', ordersController.getByClient);
router.get('/orders/shop/:id', ordersController.getOrdersByShop);
router.put('/orders/change-incharge', ordersController.updateIncharge);
router.put('/orders/visited/:id', ordersController.visited);

// domiciliarios
router.get('/incharges/shop/:id', inchargesController.getByShop);
router.post('/incharges', inchargesController.store);

module.exports = router;