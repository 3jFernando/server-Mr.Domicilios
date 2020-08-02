const mongoose = require('mongoose');

const db_connect = mongoose.connect(process.env.MONGOLAB_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useMongoClient: true
});

db_connect.then(connect => console.log("Conexion a db exitosa: "));
db_connect.catch(err => console.log("error de conexion a db: ", err));