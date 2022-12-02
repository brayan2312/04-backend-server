require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');

//Crear el servidor express
const app = express();

//Configurar cors
app.use(cors());

//Carpeta Public
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json() )

// Conexion
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes') );
app.use('/api/login', require('./routes/auth.routes') );
app.use('/api/hospitales', require('./routes/hospital.routes') );
app.use('/api/medicos', require('./routes/medico.routes') );
app.use('/api/todo', require('./routes/busquedas.routes') );
app.use('/api/upload', require('./routes/upload.routes') );


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});