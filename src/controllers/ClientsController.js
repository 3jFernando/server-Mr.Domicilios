const Client = require('../models/Client');
const bcrypt = require('bcryptjs');
const getSaltHashPassword = require('../utils/hash_password');

class ClientsController {

  // todos los clientes
  getAll = async (req, res) => {

    try {
      const clients = await Client.find({});
      return res.status(200).json({ 'clients': clients, 'status': 200, 'heroku': true });
    } catch (e) {
      return res.status(500).json({ 'clients': null, 'error': e, 'status': 500 });
    }

  }

  // crear cliente
  store = async (req, res) => {

    // validar que el correo no exista
    const existClient = await Client.findOne({ email: req.body.email });
    if (existClient) return res.status(200).json({ 'client': null, 'status': 460, 'message': "La direccion de correo electronico ingresada ya existe." });

    try {
      const client = new Client();
      client.name = req.body.name;
      client.email = req.body.email;
      client.phone = req.body.phone;
      client.address = req.body.address;
      client.city = req.body.city;

      // contraseña encriptada        
      const hash = await getSaltHashPassword(req.body.password);
      client.password = hash;

      await client.save();
      return res.status(200).json({ 'client': client, 'status': 200 });

    } catch (e) { return res.status(500).json({ 'client': null, 'error': e, 'status': 500 }); }

  }

  // actualizar cliente
  update = async (req, res) => {

    // validar que el correo no exista
    const client = await Client.findOne({ _id: req.params.id });
    if (!client) return res.status(400).json({ 'client': null, 'status': 460, 'message': "El cliente esta presentando problemas, es necesario que vuelvas a iniciar tu sesion." });

    try {
      client.name = req.body.name;
      client.email = req.body.email;
      client.phone = req.body.phone;
      client.address = req.body.address;
      client.city = req.body.city;

      await client.save();
      return res.status(200).json({ 'client': client, 'status': 200 });

    } catch (e) { return res.status(500).json({ 'client': null, 'error': e, 'status': 500 }); }

  }

  // cliente login
  login = async (req, res) => {

    // validar email
    const client = await Client.findOne({ email: req.body.email });
    if (!client) return res.status(200).json({ 'client': req.body, 'status': 460, 'message': "Correo electronico no encontrado!" });

    // validar password
    const checkPassword = await bcrypt.compare(req.body.password, client.password);
    if (!checkPassword) return res.status(200).json({ 'client': req.body, 'status': 470, 'message': "Contraseña incorrecta!" });

    return res.status(200).json({ 'client': client, 'status': 200 });
  }

}

const clientsController = new ClientsController();
module.exports = clientsController;