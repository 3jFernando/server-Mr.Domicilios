const mongoose = require('mongoose');

const db_connect = mongoose.connect('mongodb+srv://userapp:tJNicAi35JJ4fUWB@cluster0-7sj4r.mongodb.net/mr_domicilios', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db_connect.then(connect => console.log("Database connected."));
db_connect.catch(err => console.log("error de conexion a db: ", err));