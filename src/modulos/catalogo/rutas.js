const express = require('express');
const multer = require('multer');
const path = require('path');
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: './images/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'FOTO' || file.fieldname === 'DIBUJO') {
            cb(null, true);
        } else {
            cb(new Error('Campo de archivo inesperado'));
        }
    }
});


// Rutas de consulta
router.get('/', todos);
router.get('/pzas', pzas);
router.get('/:id', uno);
// Rutas de agregar
router.post('/', upload.fields([{ name: 'FOTO' }, { name: 'DIBUJO' }]), agregar)

// Consultar todos
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

async function pzas(req, res, next) {
    try {
        const items = await controlador.piezas();
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

// Consultar un solo item
async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

// Agregar
async function agregar(req, res, next) {
    try {
        const { idPieza, NoPieza, Descripcion, Especificaciones, idMaterial, PesoKg, PrecioUnitario, Activo } = req.body;
        const { FOTO, DIBUJO } = req.files;

        // Obteniendo los nombres de los archivos de las imágenes
        const nombreFoto = FOTO ? FOTO[0].filename : null;
        const nombreDibujo = DIBUJO ? DIBUJO[0].filename : null;

        console.log(idPieza)
        // Lógica para guardar los datos en la base de datos
        // Asegúrate de usar el ORM o la consulta SQL adecuada para tu base de datos
        await controlador.guardarPieza({
            idPieza,
            NoPieza,
            Descripcion,
            Especificaciones,
            idMaterial,
            PesoKg,
            PrecioUnitario,
            Activo,
            FOTO: nombreFoto,
            DIBUJO: nombreDibujo,
        });
        if (req.body.idPieza == 0) {
            mensaje = 'Item guardado con exito';
        } else {
            mensaje = 'Item actualizado con exito';
        }
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        // Manejar errores
        console.error('Error al agregar la pieza:', err);
        respuesta.error(req, res, 'Error al agregar la pieza', 500);
    }
}

module.exports = router;
