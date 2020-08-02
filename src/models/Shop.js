const mongoose = require('mongoose');

const schema = mongoose.Schema({
 name: String,
 phone: String,
 email: String,
 password: String,
 // valor del domicilio
 value_delivery: {
   type: String,
   default: 0,
 },
 // tiempos de entrega
 time_type: String,
 time_number: Number,
 // categorias - puede tener varias (Drogueria, Panaderia, Heladeria)
 // se almancena como string pero se debe parsear a JSON de nuevo 
 categories_shops: {
   type: String,
   default: JSON.stringify([])
 },
 // direccion - ubicacion en el mapa
 address_lat:  {
   type: String,
   default: 1.85371
 },
 address_lgn: {
   type: String,
   default: -76.05071
 },
 photo: String
});

const Shop = mongoose.model('shops', schema);
module.exports = Shop;