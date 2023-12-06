const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

// Rutas de consulta
router.get('/', todos);
router.get('/:id', uno)
router.post('/pedidoid', unoPorPedido);
router.post('/consultarPorFecha', consultarPorFecha);
router.post('/consultarEstatus', consultarEstatusxFecha);
// Rutas para guardar (insertar o actualizar)
router.post('/', agregar);
// Rutas para eliminar
router.put('/', eliminar);
// Consultar todos
async function todos(req, res, next) {
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }catch(err) {
        next(err);
    }
};

// Consultar un solo item
async function uno(req, res, next) {
    try{
        const items = await controlador.uno(req.params.id);    
        respuesta.success(req, res, items, 200);
    }catch(err) {
        next(err);
    }
};

async function uno(req, res, next) {
    try{
        const items = await controlador.uno(req.params.id);    
        respuesta.success(req, res, items, 200);
    }catch(err) {
        next(err);
    }
};


// Agregar
async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        if (req.body.idPedido == 0) {
            mensaje = 'Item guardado con exito';
        } else {
            mensaje = 'Item actualizado con exito';
        }
        respuesta.success(req, res, mensaje, 201);
    } catch(err) {
        next(err);
    }
};

// Eliminar
async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        if (items.affectedRows > 0) {
            mensaje = 'Item eliminado satisfactoriamente';
        } else {
            mensaje = 'No se encontró ningún registro para eliminar.';
        }
        respuesta.success(req, res, mensaje, 200);
    } catch(err) {
        next(err);
    }
};

async function unoPorPedido(req, res, next) {

    try {
        const items = await controlador.unoPorPedido(req.body);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function consultarPorFecha(req, res, next) {
    try {
        const fechas = req.body; // Suponiendo que las fechas se envían en el cuerpo de la solicitud
        const items = await controlador.consultarPorFecha(fechas);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

async function consultarEstatusxFecha(req, res, next) {
    try {
        const fechas = req.body; // Suponiendo que las fechas se envían en el cuerpo de la solicitud
        const items = await controlador.consultarEstatusxFecha(fechas);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;