const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const TABLA = 'usuarios';
const COLUMNAID = 'idUsuario';
const ESTATUS = "Activo";

function todos() {
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, COLUMNAID, id);
}

async function agregar(body) {
    console.log(body);

    if (body.Contrasena) {
        body.Contrasena = await bcrypt.hash(body.Contrasena.toString(), 5); // Aumenté el número de rondas a 5
    }

    return db.agregar(TABLA, COLUMNAID, body);
}

function eliminar(body) {
    return db.eliminar(TABLA, COLUMNAID, body);
}

async function login(body) {
    const data = await db.queryFlex(TABLA,{ Usuario: body.Usuario, Activo: 1 });

    if (data[0] === undefined || !(await bcrypt.compare(body.Contrasena, data[0].Contrasena))) {
        return {
            token: null
        };
    }

    const token = jwt.sign({ user: data[0].Usuario }, config.jwt.secret, { expiresIn: '1d' });

    return {
        token: token
    };
}

async function obtenerUsuarioDesdeToken(token) {
    try {
        const tokenWithoutBearer = extractTokenWithoutBearerPrefix(token);
        const decoded = jwt.verify(tokenWithoutBearer, config.jwt.secret);
        return decoded.user;
    } catch (error) {
        throw new Error('Token inválido');
    }
}

function extractTokenWithoutBearerPrefix(token) {
    if (token && token.startsWith('Bearer ')) {
        return token.slice(7);
    }
    return token;
}

async function permisos(req) {
    try {
        const token = req.headers['authorization']; // Accede al token de autorización desde el encabezado
        const tokenWithoutBearer = extractTokenWithoutBearerPrefix(token); // Elimina el prefijo 'Bearer ' del token
        console.log(tokenWithoutBearer);        
        const usuario = await obtenerUsuarioDesdeToken(tokenWithoutBearer);
        const datosUsuario = await db.query(TABLA, { Usuario: usuario });
        console.log(datosUsuario[0]);
        console.log(datosUsuario[0].idRol);
        const idRol = datosUsuario[0].idRol;
        const permisos = await db.query("roles_has_permisos", { Roles_idRol: idRol });
        console.log(permisos)

        switch (req.body.Interfaz) {
            case "Roles":                
                for (const permiso of permisos) { // Cambiado 'for...in' a 'for...of'
                    if (permiso.Permisos_idPermiso === 1) { // Verifica el ID del permiso, suponiendo que 1 es el ID necesario
                        return true;
                    }
                }                
                break;
            
            default:
                break;
        }
        console.log("No hay permisos")
        return false;        
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    login,
    permisos
};