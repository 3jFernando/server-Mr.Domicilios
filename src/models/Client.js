const mongoose = require('mongoose');

const schema = mongoose.Schema({
 name: String,
 email: String,
 password: String,
 phone: String,
 city: String,
 address: String,
 address_lat: String,
 address_lgn: String,
});

const Client = new mongoose.model('clients', schema);
module.exports = Client;