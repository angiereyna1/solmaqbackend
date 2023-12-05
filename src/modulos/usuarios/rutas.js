const express = require('express');
const respuesta = require('../../red/respuestas')
const controlador = require('./controlador')


const router = express.Router();

router.get('/', todos);
router.get('/nicks', nicks);
router.get('/:id', uno);
router.post('/userid', unoPorUser);
router.post('/idUsuario', idPorUser);
router.post('/', agregar);
router.put('/', eliminar);
router.post('/login',login);
router.post('/permisos',consultarPermisos);
router.post('/auth',verificacion);

async function login(req, res, next){
    try {
        const token = await controlador.login(req.body);
        respuesta.success(req, res, token, 200);
    } catch (error) {
        next(error);
    }
}

async function consultarPermisos(req, res, next){
    try {
        const token = await controlador.consultarPermisos(req.body);
        respuesta.success(req, res, token, 200);
    } catch (error) {
        next(error);
    }
}

async function verificacion(req ,res, next){
    try {
        console.log(req.body)                
        const admitido = await controlador.permisos(req);
        console.log(admitido)
        if(!admitido){
            respuesta.error(req, res,{accepted:false, message:"No autorizado"}, 403);
        }else{
            respuesta.success(req, res, {accepted:true, message:"Autorizado", user:admitido.user}, 200);
        }
    } catch (error) {
        next(error);
    }
} 

async function todos(req, res, next) {

    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);

    }
};

async function nicks(req, res, next) {
    try {
        const items = await controlador.nicks();
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        console.log(items)
        if (req.body.idUsuario == 0) {
            mensaje = items.insertId;
        } else {
            mensaje = 'Item actualizado con exito';
        }

        respuesta.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
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

async function unoPorUser(req, res, next) {

    try {
        const items = await controlador.unoPorUser(req.body);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function idPorUser(req, res, next) {

    try {
        const items = await controlador.idPorUser(req.body);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;