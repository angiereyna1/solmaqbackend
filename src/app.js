const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');

const roles = require('./modulos/roles/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const permisos = require('./modulos/permisos/rutas');
const permisosRoles = require('./modulos/permisosRoles/rutas');
const clientes = require('./modulos/clientes/rutas');
const catalogo = require('./modulos/catalogo/rutas');
const materiales = require('./modulos/materiales/rutas');
const rfq = require('./modulos/rfq/rutas');
const piezasrfq = require('./modulos/piezasRfq/rutas');
const pedidos = require('./modulos/pedidos/rutas');
const detallespedidos = require('./modulos/detallesPedidos/rutas')
const tipopieza = require('./modulos/tipoPieza/rutas');

const error = require('./red/errors');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración definimos la constante del puerto
app.set('port', config.app.port)

const whiteList = [process.env.ORIGIN1];

console.log("Aquiiiiiiiiiii")
console.log(whiteList);

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
app.use('/api/roles', roles);
app.use('/api/usuarios', usuarios);
app.use('/api/permisos',permisos);
app.use('/api/permisosRoles', permisosRoles);
app.use('/api/clientes', clientes);
app.use('/api/catalogo', catalogo);
app.use('/api/materiales', materiales);
app.use('/api/rfq', rfq);
app.use('/api/piezasrfq', piezasrfq);
app.use('/api/pedidos', pedidos);
app.use('/api/detallesPedidos', detallespedidos);
app.use('/api/tipopieza', tipopieza);
app.use('/images', express.static('images'));

app.use(error);

//exportamos app
module.exports = app;