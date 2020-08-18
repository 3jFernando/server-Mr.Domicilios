const mongoose = require('mongoose');

const db_connect = mongoose.connect(process.env.MONGOLAB_URI_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db_connect.then(connect => console.log("Database connected."));
db_connect.catch(err => console.log("error de conexion a db: ", err));