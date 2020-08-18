const Order = require('../models/Order');
const ProductOrder = require('../models/ProductOrder');
const Shop = require('../models/Shop');
const Client = require('../models/Client');
const Product = require('../models/Product');
const Incharge = require('../models/Incharge');

class OrdersController {

  constructor() { }

  // crear ordenes
  store = async (req, res) => {

    try {

      const orders = [];
      const data = req.body.data;
      const clients = await Client.find();
      const itemsProducts = await Product.find();
      await data.map(item => {

        // cerar la orden
        const order = new Order();

        order.shop_id = item.shop._id;
        order.client_id = req.body.client_id;
        order.value_delivery = req.body.total_delivery;
        order.note = req.body.note;
        
        // guardar los productos de la orden
        // productos
        const products = [];
        let total = 0;
        item.products.map(po => {

          const product = new ProductOrder();

          product.order_id = order._id;
          product.product_id = po._id;
          product.value_unit = po.price;
          product.cant = po.cant_shop;
          product.total = po.total;

          // total de los producto por orden
          total += parseFloat(po.total);
          product.save();

          const details = itemsProducts.filter(i => i._id == po._id);
          products.push({
            cant: po.cant_shop,
            total: po.total,
            value_unit: po.price,
            _id: po._id,
            product: details.length > 0 ? details[0] : { name: "No definido" }  
          })

        });

        order.total = total;
        order.save();

        // cliente
        const client = clients.filter(c => c._id == req.body.client_id);

        orders.push({
          shop_id: order.shop_id,
          create_at: order.create_at,
          value_delivery: order.value_delivery,
          total: total,
          _id: order._id,
          note: order.note,
          products,
          client: client.length > 0 ? client[0] : {name: 'No definido'}
        });

      });

      return res.status(200).json({ 'status': 200, 'orders': orders });
    } catch (e) {
      return res.status(200).json({ 'status': 500, 'order': null, 'error': e });
    }
  }

  // cargar ordenes por cliente
  getByClient = async (req, res) => {

    try {
      const ordersData = await Order.find({ client_id: req.params.id, state: 'Activa' });
      const shops = await Shop.find();
      const orders = [];

      ordersData.map(order => {
        let shop = null;
        shops.filter(s => {
          if (s._id == order.shop_id) shop = s;
        });

        const date = new Date(order.create_at);
        const datestring = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
          date.getHours() + ":" + date.getMinutes();

        orders.push({
          total: order.total,
          value_delivery: order.value_delivery,
          create_at: datestring,
          _id: order._id,
          shop_id: order.shop_id,
          client_id: order.client_id,
          note: order.note,
          state: order.state,
          shop,
        });
      });

      return res.status(200).json({ 'status': 200, 'orders': orders });
    } catch (e) {
      return res.status(500).json({ 'status': 500, 'orders': null, 'error': e });
    }

  }

  // el cliente puede ver el detalle de una orden
  async getDetails(req, res) {

    try {

      const orderFind = await Order.findById(req.params.id);

      if (!orderFind)  return res.status(200).json({ 'status': 460, 'order': null })

      // tienda
      const shop = await Shop.findById(orderFind.shop_id);

      // products orden
      const _productsAll = await Product.find({shop_id: shop._id});
      const items = await ProductOrder.find({ order_id: orderFind.id });
      const products = [];
      items.map(item => {        
        const product = _productsAll.filter(p => p._id == item.product_id);
        
        products.push({
          value_unit: item.value_unit,
          total: item.total,
          _id: item._id,
          cant: item.cant,
          product: product.length > 0 ? product[0] : {name: 'Producto erroneo.'}
        });
      });
    
      const order = {
        _id: orderFind._id,
        state: orderFind.state,
        total: orderFind.total,
        create_at: orderFind.create_at,
        value_delivery: orderFind.value_delivery,
        note: orderFind.note,
        shop,
        products
      }

      return res.status(200).json({ 'status': 200, 'order': order })

    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e })
    }

  }

  // ordernes por tienda
  getOrdersByShop = async (req, res) => {

    try {

      const ordersData = await Order.find({ shop_id: req.params.id });
      const clients = await Client.find();
      const products_order = await ProductOrder.find();
      const products = await Product.find();

      let orders = [];
      ordersData.map((order, index) => {

        const _client = clients.filter(c => c._id == order.client_id);

        // productos de la orden
        const _products = [];
        products_order.filter(po => {
          if (po.order_id == order._id) {

            // detalles
            const details = products.filter(p => p._id == po.product_id);

            _products.push({
              cant: po.cant,
              total: po.total,
              value_unit: po.value_unit,
              _id: po._id,
              product: details.length > 0 ? details[0] : { name: "No definido" }
            });
          }
        });

        orders.push({
          _id: order._id,
          state: order.state,
          visited: order.visited,
          total: order.total,
          create_at: order.create_at,
          value_delivery: order.value_delivery,
          incharge_id: order.incharge_id,
          client: _client.length > 0 ? _client[0] : { name: "No definido" },
          products: _products
        });
      });

      // order de ultima a primera
      orders = orders.sort((a, b) => b.create_at - a.create_at);

      return res.status(200).json({ 'status': 200, 'orders': orders });

    } catch (e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }

  // modificar domiciliario
  updateIncharge = async (req, res) => {
    try {
      return this.findAnnUpdate(req.body, 'asing to incharge', res);    
    } catch (e) {
      return res.status(200).json({ 'status': 500, 'order': null, 'error': e });
    }
  }

  // cancelar una orden
  cancel = async (req, res) => {    
    try {
      return this.findAnnUpdate(req.body, 'cancel', res);    
    } catch (e) {
      return res.status(200).json({ 'status': 500, 'order': null, 'error': e });
    }
  }

  // actualizar orden y asignar encargado
  // tambien ese usa para cancelarla
  async findAnnUpdate(data, action, res) {
    // buscar la orden
    const order = await Order.findById(data.id);
    if (!order) return res.status(200).json({ 'status': 460 });           

    // encargado
    const idIncharge = (action === 'cancel') ? order.incharge_id : data.incharge_id;
    const incharge = await Incharge.findById(idIncharge);
    if (!incharge) {
      if(action !== 'cancel') {       
        return res.status(200).json({ 'status': 470 }); 
      }
    }

    // accion
    if(action === 'cancel') {
      order.state = "Cancelada";
      if (incharge) incharge.state = 'Libre';
    } else {
      // actualizar el encargado
      order.incharge_id = incharge._id;
      // se asume que se esta enviado el pedido con el encargado
      order.state = "En camino";
      incharge.state = 'Ocupado';
    }
    
    if (incharge) await incharge.save();
    await order.save();
    
    return res.status(200).json({ 'status': 200, 'order': order });
  }

  // al ver detalles de una orden deja de ser nueva
  async visited(req, res) {

    try {

      const order = await Order.findById(req.params.id);
      if(order) {
        order.visited = true;
        await order.save();
      }

      return res.status(200).json({ 'status': 200 });
    } catch(e) {
      return res.status(500).json({ 'status': 500, 'error': e });
    }

  }  

}

const ordersController = new OrdersController();
module.exports = ordersController;