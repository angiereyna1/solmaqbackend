const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');

const roles = require('./modulos/roles/rutas');
const usuarios = require('./modulos/usuarios/rutas');

const error = require('./red/errors');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración definimos la constante del puerto
app.set('port', config.app.port)

const whiteList = [process.env.ORIGIN1];
app.use(cors({
    origin: function(origin, callback){
        if(!origin || whiteList.includes(origin)){
            return callback(null, origin);
        }
        return callback("Error de CORS origin: " + origin + " NO AUTORIZADO!")
    },
    //Habilitamos el uso de credenciales
    //credentials: true
}));

// rutas
app.use('/api/roles', roles)
app.use('/api/usuarios', usuarios)
app.use(error);

//exportamos app
module.exports = app;