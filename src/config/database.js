const mongoose = require('mongoose');

const uri = process.env.MONGOLAB_URI_LOCAL || 'mongodb+srv://userapp:tJNicAi35JJ4fUWB@cluster0-7sj4r.mongodb.net/mr_domicilios';
const db_connect = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db_connect.then(connect => console.log("Conexion a db exitosa: "));
db_connect.catch(err => console.log("error de conexion a db: ", err));